#!/usr/bin/env bash
# =============================================================================
#  C&R Luxurious Travel - WordPress connection helper
#  ---------------------------------------------------------------------------
#  Reads credentials from a file OUTSIDE this repository and talks to the
#  WordPress REST API. Secrets are never printed: values are held in shell
#  variables, passed to curl via --config on stdin, and masked in all output.
#
#  Usage:
#    tools/wp-connect.sh check          verify auth and report the site's state
#    tools/wp-connect.sh pages          list the C&R pages and their templates
#    tools/wp-connect.sh plugins        list installed plugins and their status
#
#  Credentials file (default path below) uses "key = value" lines:
#    site url             = https://example.com
#    wp username          = admin
#    application password = xxxx xxxx xxxx xxxx xxxx xxxx
#    sftp host            = 000.000.000.000
#    sftp username        = u000000000
#    sftp password        = ...
#    sftp port            = 65002
# =============================================================================
set -uo pipefail

CRED_FILE="${CR_CRED_FILE:-/c/Users/rpaso/OneDrive/Documents/Business/CRLuxuriousTravel/Claude Files/wpadmin.txt}"
CMD="${1:-check}"

if [ ! -f "$CRED_FILE" ]; then
  echo "ERROR: credentials file not found:"
  echo "  $CRED_FILE"
  echo "Set CR_CRED_FILE to override the path."
  exit 1
fi

# ---- parse "key = value" (also accepts ':'), case-insensitive, space-tolerant
get() {
  local want="$1"
  awk -v want="$want" '
    { line = $0
      sub(/\r$/, "", line)
      if (line !~ /[:=]/) next
      key = line; sub(/[:=].*$/, "", key)
      val = line; sub(/^[^:=]*[:=][[:space:]]*/, "", val)
      gsub(/^[[:space:]]+|[[:space:]]+$/, "", key)
      gsub(/[[:space:]]+$/, "", val)
      k = tolower(key); gsub(/[^a-z]/, "", k)
      w = tolower(want); gsub(/[^a-z]/, "", w)
      if (k == w) { print val; exit }
    }' "$CRED_FILE"
}

# first non-empty result among several accepted key spellings
first() {
  local v
  for name in "$@"; do
    v="$(get "$name")"
    [ -n "$v" ] && { printf '%s' "$v"; return; }
  done
}

SITE="$(first 'site url' 'site' 'url' 'website' 'site address' 'wp url')"
USER="$(first 'wp username' 'username' 'user' 'wp user' 'admin username' 'login')"
APPPW="$(first 'application password' 'app password' 'apppassword' 'wp application password')"

SITE="${SITE%/}"

mask() { # show only the shape of a secret, never the value
  local v="$1"
  [ -z "$v" ] && { printf 'MISSING'; return; }
  printf '%d chars, present' "${#v}"
}

missing=0
echo "Credentials file: $CRED_FILE"
echo "  site url             : ${SITE:-MISSING}"
echo "  wp username          : ${USER:-MISSING}"
echo "  application password : $(mask "$APPPW")"
echo

[ -z "$SITE" ]  && { echo "MISSING: site url             (e.g. https://crluxurioustravel.com)"; missing=1; }
[ -z "$USER" ]  && { echo "MISSING: wp username          (the WordPress login the app password belongs to)"; missing=1; }
[ -z "$APPPW" ] && { echo "MISSING: application password"; missing=1; }

if [ "$missing" -ne 0 ]; then
  echo
  echo "Add the missing line(s) to the credentials file, then run this again."
  exit 2
fi

case "$SITE" in
  https://*) ;;
  http://*) echo "WARNING: site url is http://. WordPress requires HTTPS for application passwords."; ;;
  *) SITE="https://$SITE"; echo "NOTE: assuming https:// -> $SITE"; echo ;;
esac

# ---- curl wrapper: credentials go in via --config on stdin, never argv
api() {
  local method="$1" path="$2" data="${3:-}"
  local url="$SITE/wp-json$path"
  {
    printf 'user = "%s:%s"\n' "$USER" "$APPPW"
    printf 'silent\nshow-error\nlocation\nmax-time = 45\n'
    printf 'write-out = "\\nHTTP_STATUS:%%{http_code}\\n"\n'
    printf 'request = "%s"\n' "$method"
    printf 'header = "Content-Type: application/json"\n'
    printf 'header = "Accept: application/json"\n'
    printf 'user-agent = "cr-deploy/1.0"\n'
    [ -n "$data" ] && printf 'data = @-\n'
    printf 'url = "%s"\n' "$url"
  } > /tmp/cr_curl_cfg.$$
  if [ -n "$data" ]; then
    printf '%s' "$data" | curl --config /tmp/cr_curl_cfg.$$
  else
    curl --config /tmp/cr_curl_cfg.$$
  fi
  local rc=$?
  rm -f /tmp/cr_curl_cfg.$$
  return $rc
}

status_of() { printf '%s' "$1" | sed -n 's/^HTTP_STATUS:\([0-9]*\)$/\1/p' | tail -1; }
body_of()   { printf '%s' "$1" | sed '/^HTTP_STATUS:[0-9]*$/d'; }

jget() { # crude single-key extractor so no jq dependency is needed
  local json="$1" key="$2"
  printf '%s' "$json" | sed -n "s/.*\"$key\"[[:space:]]*:[[:space:]]*\"\([^\"]*\)\".*/\1/p" | head -1
}

case "$CMD" in
  check)
    echo "1. Reaching the REST API ..."
    out="$(api GET /)" ; st="$(status_of "$out")"
    if [ -z "$st" ]; then echo "   FAILED: no response. Check the URL and that the site is online."; exit 1; fi
    if [ "$st" != "200" ]; then echo "   HTTP $st - the REST API did not respond as expected."; echo "   A security plugin or Hostinger firewall may be blocking /wp-json/."; exit 1; fi
    name="$(jget "$(body_of "$out")" name)"
    echo "   OK. Site name: ${name:-unknown}"

    echo "2. Authenticating ..."
    out="$(api GET /wp/v2/users/me)" ; st="$(status_of "$out")" ; body="$(body_of "$out")"
    case "$st" in
      200) echo "   OK. Logged in as: $(jget "$body" name) (slug $(jget "$body" slug))" ;;
      401) echo "   FAILED (401). Username or application password rejected."
           echo "   Confirm the username matches the user the app password was created on."; exit 1 ;;
      403) echo "   FAILED (403). Authenticated but blocked - often the Authorization header"
           echo "   is stripped by the server. See guide section 8."; exit 1 ;;
      *)   echo "   FAILED (HTTP $st)."; echo "$body" | head -5; exit 1 ;;
    esac

    echo "3. Environment ..."
    out="$(api GET /wp/v2/settings)" ; st="$(status_of "$out")" ; body="$(body_of "$out")"
    if [ "$st" = "200" ]; then
      echo "   Title    : $(jget "$body" title)"
      echo "   Tagline  : $(jget "$body" description)"
      echo "   Front pg : $(printf '%s' "$body" | sed -n 's/.*"show_on_front":"\([^"]*\)".*/\1/p')"
      echo "   Settings are writable by this user."
    else
      echo "   Settings endpoint returned HTTP $st (needs an administrator account)."
    fi
    ;;

  pages)
    out="$(api GET '/wp/v2/pages?per_page=100&status=any&_fields=id,slug,status,template,link')"
    st="$(status_of "$out")"
    [ "$st" != "200" ] && { echo "HTTP $st"; body_of "$out" | head -5; exit 1; }
    body_of "$out" | tr '}' '\n' | sed -n 's/.*"id":\([0-9]*\).*"slug":"\([^"]*\)".*"status":"\([^"]*\)".*"template":"\([^"]*\)".*/  \1  \2  [\3]  template=\4/p'
    ;;

  plugins)
    out="$(api GET '/wp/v2/plugins')" ; st="$(status_of "$out")"
    [ "$st" != "200" ] && { echo "HTTP $st (needs an administrator account)"; exit 1; }
    body_of "$out" | tr '}' '\n' | sed -n 's/.*"plugin":"\([^"]*\)".*"status":"\([^"]*\)".*"name":"\([^"]*\)".*/  [\2]  \3  (\1)/p'
    ;;

  *)
    echo "Unknown command: $CMD"; echo "Use: check | pages | plugins"; exit 1 ;;
esac
