#!/usr/bin/env bash
# =============================================================================
#  C&R Luxurious Travel - file deployment helper
#  ---------------------------------------------------------------------------
#  Uploads the plugin folder to the WordPress site. Credentials come from the
#  same file wp-connect.sh reads and are passed to curl via --config on stdin,
#  so they never appear in argv, process listings or output.
#
#  Transport (CR_TRANSPORT):
#    sftp  (default) SSH file transfer on port 65002. Fully encrypted and the
#          host key is verified against a known_hosts file built with
#          ssh-keyscan. Paths are home-relative via the /~/ prefix.
#    ftps  Explicit TLS on port 21. Also encrypted, but the shared certificate
#          does not match the bare IP address hPanel supplies, so the identity
#          check is relaxed. Fallback only.
#
#  Usage:
#    tools/wp-deploy.sh test               list the WordPress root
#    tools/wp-deploy.sh ls <remote-path>   list a directory below the web root
#    tools/wp-deploy.sh upload             upload the whole plugin folder
#    tools/wp-deploy.sh verify             list what is on the server now
# =============================================================================
set -uo pipefail

CRED_FILE="${CR_CRED_FILE:-/c/Users/rpaso/OneDrive/Documents/Business/CRLuxuriousTravel/Claude Files/wpadmin.txt}"
CMD="${1:-test}"
REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PLUGIN_DIR="$REPO/wordpress/plugin/cr-luxurious-travel"

[ -f "$CRED_FILE" ] || { echo "ERROR: credentials file not found: $CRED_FILE"; exit 1; }

get() {
  local want="$1"
  awk -v want="$want" '
    { line=$0; sub(/\r$/,"",line)
      if (line !~ /[:=]/) next
      key=line; sub(/[:=].*$/,"",key)
      val=line; sub(/^[^:=]*[:=][[:space:]]*/,"",val)
      gsub(/^[[:space:]]+|[[:space:]]+$/,"",key); gsub(/[[:space:]]+$/,"",val)
      k=tolower(key); gsub(/[^a-z]/,"",k)
      w=tolower(want); gsub(/[^a-z]/,"",w)
      if (k==w) { print val; exit } }' "$CRED_FILE"
}
first() { local v; for n in "$@"; do v="$(get "$n")"; [ -n "$v" ] && { printf '%s' "$v"; return; }; done; }

HOST="$(first 'sftp host' 'ftp host' 'host')"
SUSER="$(first 'sftp username' 'ftp username' 'sftp user')"
SPASS="$(first 'sftp password' 'ftp password' 'sftp pass')"
SITE="$(first 'site url' 'site' 'url')"

HOST="$(printf '%s' "$HOST" | sed -E 's#^[a-zA-Z]+://##; s#/.*$##')"
DOMAIN="$(printf '%s' "$SITE" | sed -E 's#^[a-zA-Z]+://##; s#/.*$##; s#^www\.##')"
DOMAIN="${CR_DOMAIN:-$DOMAIN}"
WEBROOT="domains/$DOMAIN/public_html"
WEBROOT="${CR_REMOTE_ROOT:-$WEBROOT}"
WEBROOT="${WEBROOT#/}"; WEBROOT="${WEBROOT%/}"

for v in HOST SUSER SPASS; do
  [ -z "${!v}" ] && { echo "MISSING credential: $v"; exit 2; }
done

TRANSPORT="${CR_TRANSPORT:-sftp}"
EXTRA_OPTS=()

if [ "$TRANSPORT" = "sftp" ]; then
  PORT="${CR_SFTP_PORT:-65002}"
  BASE="sftp://$HOST:$PORT/~/$WEBROOT"
  # libssh2 refuses to connect without a known_hosts file, and this build
  # cannot negotiate ed25519, so scan and pin the RSA host key.
  KH="${TMPDIR:-/tmp}/cr_known_hosts_${HOST//./_}_$PORT"
  [ -s "$KH" ] || ssh-keyscan -p "$PORT" -T 15 -t rsa "$HOST" 2>/dev/null | grep -v '^#' > "$KH"
  [ -s "$KH" ] || { echo "ERROR: could not retrieve the SSH host key from $HOST:$PORT"; exit 1; }
  KH_CURL="$KH"; command -v cygpath >/dev/null 2>&1 && KH_CURL="$(cygpath -m "$KH")"
  EXTRA_OPTS+=("knownhosts = \"$KH_CURL\"")
  SECURITY="host key verified"
else
  PORT=21
  BASE="ftp://$HOST:$PORT/$WEBROOT"
  EXTRA_OPTS+=('ssl-reqd')
  [ "${CR_STRICT_TLS:-0}" = "1" ] || EXTRA_OPTS+=('insecure')
  SECURITY="TLS encrypted, certificate identity not checked"
fi

echo "Target    : $SUSER@$HOST:$PORT over ${TRANSPORT^^}  ($SECURITY)"
echo "Web root  : $WEBROOT"
echo

xfer() {
  local url="$1"; shift
  {
    printf 'user = "%s:%s"\n' "$SUSER" "$SPASS"
    printf 'silent\nshow-error\nconnect-timeout = 25\nmax-time = 180\n'
    for o in "${EXTRA_OPTS[@]}"; do printf '%s\n' "$o"; done
    for extra in "$@"; do printf '%s\n' "$extra"; done
    printf 'url = "%s"\n' "$url"
  } | curl --config -
}

case "$CMD" in
  test)
    echo "Listing the WordPress root ..."
    xfer "$BASE/" 'list-only'
    echo "(curl exit $?)"
    ;;

  ls)
    p="${2:-}"; p="${p#/}"
    xfer "$BASE/${p:+$p/}" 'list-only'
    echo "(curl exit $?)"
    ;;

  upload)
    DEST="$BASE/wp-content/plugins/cr-luxurious-travel"
    echo "Uploading the plugin to wp-content/plugins/cr-luxurious-travel ..."
    ok=0; fail=0
    while IFS= read -r f; do
      rel="${f#"$PLUGIN_DIR"/}"
      # curl is a native Windows build and cannot open MSYS-style /c/... paths
      lf="$f"; command -v cygpath >/dev/null 2>&1 && lf="$(cygpath -m "$f")"
      out="$(xfer "$DEST/$rel" 'ftp-create-dirs' "upload-file = \"$lf\"" 2>&1)"; rc=$?
      if [ $rc -eq 0 ]; then
        printf '  ok    %s\n' "$rel"; ok=$((ok+1))
      else
        printf '  FAIL  %s (rc=%d) %s\n' "$rel" "$rc" "$(printf '%s' "$out" | head -1)"; fail=$((fail+1))
      fi
    done < <(find "$PLUGIN_DIR" -type f | sort)
    echo
    echo "Uploaded $ok file(s), $fail failure(s)."
    [ "$fail" -eq 0 ] || exit 1
    ;;

  verify)
    DEST="$BASE/wp-content/plugins/cr-luxurious-travel"
    for d in "" "assets" "pages" "templates"; do
      echo "  --- ${d:-(plugin root)}"
      xfer "$DEST/${d:+$d/}" 'list-only' | sed 's/^/      /'
    done
    ;;

  *)
    echo "Unknown command: $CMD"; echo "Use: test | ls <path> | upload | verify"; exit 1 ;;
esac
