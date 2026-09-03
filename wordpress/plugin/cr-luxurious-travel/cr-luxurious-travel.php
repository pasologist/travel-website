<?php
/**
 * Plugin Name:       C&R Luxurious Travel
 * Plugin URI:        https://github.com/pasologist/travel-website
 * Description:       Installs the C&R Luxurious Travel website: Piece 1 (global styles), Piece 2 (global script + page HTML), a blank-canvas page template, a one-click page installer and the inquiry-form mailer.
 * Version:           1.0.0
 * Requires at least: 6.7
 * Requires PHP:      7.4
 * Author:            C&R Luxurious Travel
 * License:           GPL-2.0-or-later
 * Text Domain:       cr-luxurious-travel
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'CRLT_VERSION', '1.0.0' );
define( 'CRLT_FILE', __FILE__ );
define( 'CRLT_DIR', plugin_dir_path( __FILE__ ) );
define( 'CRLT_URL', plugin_dir_url( __FILE__ ) );
define( 'CRLT_TEMPLATE_CLASSIC', 'cr-blank-canvas.php' );                 // stored in _wp_page_template on classic themes
define( 'CRLT_TEMPLATE_BLOCK', 'cr-blank-canvas' );                       // template slug on block themes
define( 'CRLT_TEMPLATE_BLOCK_ID', 'cr-luxurious-travel//cr-blank-canvas' ); // register_block_template() id
define( 'CRLT_FONTS_URL', 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Outfit:wght@300;400;500;600&family=Parisienne&display=swap' );

/* -------------------------------------------------------------------------
 * 1. Page manifest  (slug => title + HTML file in /pages)
 * ---------------------------------------------------------------------- */
function crlt_pages() {
	return array(
		'home'          => array( 'title' => 'Home',              'file' => 'home.html' ),
		'stays'         => array( 'title' => 'Stays',             'file' => 'stays.html' ),
		'stay'          => array( 'title' => 'Stay',              'file' => 'stay.html' ),
		'all-inclusive' => array( 'title' => 'All-Inclusive',     'file' => 'all-inclusive.html' ),
		'dining'        => array( 'title' => 'Dining',            'file' => 'dining.html' ),
		'spa'           => array( 'title' => 'Spa & Wellness',    'file' => 'spa.html' ),
		'experiences'   => array( 'title' => 'Experiences',       'file' => 'experiences.html' ),
		'weddings'      => array( 'title' => 'Weddings & Events', 'file' => 'weddings.html' ),
		'offers'        => array( 'title' => 'Offers',            'file' => 'offers.html' ),
		'contact'       => array( 'title' => 'Contact',           'file' => 'contact.html' ),
	);
}

function crlt_is_block_theme() {
	return function_exists( 'wp_is_block_theme' ) && wp_is_block_theme();
}

function crlt_template_value() {
	return crlt_is_block_theme() ? CRLT_TEMPLATE_BLOCK : CRLT_TEMPLATE_CLASSIC;
}

/** True when $post is one of our pages (by template, by slug, or by content). */
function crlt_is_cr_page( $post = null ) {
	$post = get_post( $post );
	if ( ! $post || 'page' !== $post->post_type ) {
		return false;
	}
	$tpl = get_page_template_slug( $post );
	if ( in_array( $tpl, array( CRLT_TEMPLATE_CLASSIC, CRLT_TEMPLATE_BLOCK ), true ) ) {
		return true;
	}
	if ( array_key_exists( $post->post_name, crlt_pages() ) ) {
		return true;
	}
	return false !== strpos( (string) $post->post_content, 'class="cr"' );
}

/* -------------------------------------------------------------------------
 * 2. Assets: fonts + Piece 1 (CSS) + Piece 2 (JS) with runtime config
 * ---------------------------------------------------------------------- */
add_action( 'wp_enqueue_scripts', 'crlt_enqueue_assets' );
function crlt_enqueue_assets() {
	if ( ! is_singular( 'page' ) || ! crlt_is_cr_page() ) {
		return;
	}
	wp_enqueue_style( 'crlt-fonts', CRLT_FONTS_URL, array(), null );
	wp_enqueue_style( 'crlt-style', CRLT_URL . 'assets/cr-style.css', array(), CRLT_VERSION );
	wp_enqueue_script( 'crlt-site', CRLT_URL . 'assets/cr-site.js', array(), CRLT_VERSION, true );

	$urls = array( 'home' => home_url( '/' ) );
	foreach ( crlt_pages() as $slug => $meta ) {
		$page = get_page_by_path( $slug, OBJECT, 'page' );
		if ( $page && 'publish' === $page->post_status ) {
			$urls[ $slug ] = get_permalink( $page );
		}
	}
	$privacy_id = (int) get_option( 'wp_page_for_privacy_policy' );
	if ( $privacy_id ) {
		$urls['privacy'] = get_permalink( $privacy_id );
	}
	$base = wp_parse_url( home_url( '/' ), PHP_URL_PATH );
	$cfg  = array(
		'base'       => $base ? $base : '/',
		'ext'        => '',
		'home'       => home_url( '/' ),
		'urls'       => $urls,
		'formAction' => admin_url( 'admin-post.php' ),
		'formMode'   => 'post',
		'preview'    => false,
	);
	wp_add_inline_script( 'crlt-site', 'window.CR_CONFIG = ' . wp_json_encode( $cfg ) . ';', 'before' );
}

add_filter( 'wp_resource_hints', 'crlt_resource_hints', 10, 2 );
function crlt_resource_hints( $urls, $relation_type ) {
	if ( 'preconnect' === $relation_type && is_singular( 'page' ) && crlt_is_cr_page() ) {
		$urls[] = array( 'href' => 'https://fonts.googleapis.com', 'crossorigin' => false );
		$urls[] = array( 'href' => 'https://fonts.gstatic.com', 'crossorigin' => 'anonymous' );
		$urls[] = array( 'href' => 'https://cdn2.paraty.es', 'crossorigin' => false );
	}
	return $urls;
}

add_filter( 'body_class', 'crlt_body_class' );
function crlt_body_class( $classes ) {
	if ( is_singular( 'page' ) && crlt_is_cr_page() ) {
		$classes[] = 'cr-body';
	}
	return $classes;
}

/* -------------------------------------------------------------------------
 * 3. Blank-canvas page template (classic themes → PHP file; block themes → block template)
 * ---------------------------------------------------------------------- */
add_filter( 'theme_page_templates', 'crlt_register_classic_template', 10, 4 );
function crlt_register_classic_template( $templates, $theme, $post, $post_type ) {
	if ( crlt_is_block_theme() ) {
		return $templates;
	}
	if ( $post_type && 'page' !== $post_type ) {
		return $templates;
	}
	$templates[ CRLT_TEMPLATE_CLASSIC ] = 'C&R Blank Canvas';
	return $templates;
}

add_filter( 'template_include', 'crlt_template_include', 99 );
function crlt_template_include( $template ) {
	if ( crlt_is_block_theme() ) {
		return $template;
	}
	if ( is_singular( 'page' ) && CRLT_TEMPLATE_CLASSIC === get_page_template_slug() ) {
		$file = CRLT_DIR . 'templates/' . CRLT_TEMPLATE_CLASSIC;
		if ( file_exists( $file ) ) {
			return $file;
		}
	}
	return $template;
}

add_action( 'init', 'crlt_register_block_template' );
function crlt_register_block_template() {
	if ( ! crlt_is_block_theme() || ! function_exists( 'register_block_template' ) ) {
		return;
	}
	register_block_template(
		CRLT_TEMPLATE_BLOCK_ID,
		array(
			'title'       => 'C&R Blank Canvas',
			'description' => 'Full-bleed canvas with no theme header or footer. Used by every C&R Luxurious Travel page.',
			'content'     => '<!-- wp:post-content {"layout":{"type":"default"}} /-->',
			'post_types'  => array( 'page' ),
		)
	);
}

/* -------------------------------------------------------------------------
 * 4. Page installer
 * ---------------------------------------------------------------------- */
function crlt_page_block_content( $file ) {
	$path = CRLT_DIR . 'pages/' . $file;
	if ( ! file_exists( $path ) ) {
		return false;
	}
	$html = trim( (string) file_get_contents( $path ) );
	return "<!-- wp:html -->\n" . $html . "\n<!-- /wp:html -->";
}

/**
 * Create the C&R pages (and optionally overwrite the content of existing ones).
 *
 * @return array slug => created|updated|exists|missing-file|error
 */
function crlt_install_pages( $overwrite = false ) {
	$report = array();
	$tpl    = crlt_template_value();
	foreach ( crlt_pages() as $slug => $meta ) {
		$content = crlt_page_block_content( $meta['file'] );
		if ( false === $content ) {
			$report[ $slug ] = 'missing-file';
			continue;
		}
		$existing = get_page_by_path( $slug, OBJECT, 'page' );
		if ( $existing ) {
			if ( $overwrite ) {
				$r = wp_update_post(
					array(
						'ID'           => $existing->ID,
						'post_content' => wp_slash( $content ),
						'post_status'  => 'publish',
					),
					true
				);
				update_post_meta( $existing->ID, '_wp_page_template', $tpl );
				$report[ $slug ] = is_wp_error( $r ) ? 'error' : 'updated';
			} else {
				if ( ! get_page_template_slug( $existing ) ) {
					update_post_meta( $existing->ID, '_wp_page_template', $tpl );
				}
				$report[ $slug ] = 'exists';
			}
			continue;
		}
		$id = wp_insert_post(
			array(
				'post_type'      => 'page',
				'post_status'    => 'publish',
				'post_title'     => $meta['title'],
				'post_name'      => $slug,
				'post_content'   => wp_slash( $content ),
				'comment_status' => 'closed',
				'ping_status'    => 'closed',
				'meta_input'     => array( '_wp_page_template' => $tpl ),
			),
			true
		);
		$report[ $slug ] = is_wp_error( $id ) ? 'error' : 'created';
	}
	return $report;
}

function crlt_set_front_page() {
	$home = get_page_by_path( 'home', OBJECT, 'page' );
	if ( ! $home ) {
		return false;
	}
	update_option( 'show_on_front', 'page' );
	update_option( 'page_on_front', $home->ID );
	return true;
}

register_activation_hook( __FILE__, 'crlt_activate' );
function crlt_activate() {
	crlt_register_inquiry_cpt();
	crlt_install_pages( false );
	update_option( 'crlt_show_welcome', 1 );
}

/* -------------------------------------------------------------------------
 * 5. Admin screen: Settings → C&R Site
 * ---------------------------------------------------------------------- */
add_action( 'admin_menu', 'crlt_admin_menu' );
function crlt_admin_menu() {
	add_options_page( 'C&R Luxurious Travel', 'C&R Site', 'manage_options', 'crlt', 'crlt_admin_page' );
}

add_action( 'admin_notices', 'crlt_admin_notices' );
function crlt_admin_notices() {
	if ( ! current_user_can( 'manage_options' ) ) {
		return;
	}
	if ( get_option( 'crlt_show_welcome' ) ) {
		delete_option( 'crlt_show_welcome' );
		printf(
			'<div class="notice notice-success is-dismissible"><p><strong>C&amp;R Luxurious Travel is active.</strong> The site pages were created. Open <a href="%s">Settings → C&amp;R Site</a> to set the homepage and check the page list.</p></div>',
			esc_url( admin_url( 'options-general.php?page=crlt' ) )
		);
	}
}

function crlt_admin_page() {
	if ( ! current_user_can( 'manage_options' ) ) {
		return;
	}
	$msg   = isset( $_GET['crlt_msg'] ) ? sanitize_key( wp_unslash( $_GET['crlt_msg'] ) ) : '';
	$mode  = crlt_is_block_theme() ? 'Block theme (Site Editor) — template registered as a block template' : 'Classic theme — template registered as a PHP page template';
	$email = get_option( 'crlt_inquiry_email', get_option( 'admin_email' ) );
	$front = (int) get_option( 'page_on_front' );
	$home  = get_page_by_path( 'home', OBJECT, 'page' );
	?>
	<div class="wrap">
		<h1>C&amp;R Luxurious Travel</h1>
		<?php if ( $msg ) : ?>
			<div class="notice notice-success is-dismissible"><p><?php echo esc_html( str_replace( '-', ' ', $msg ) ); ?></p></div>
		<?php endif; ?>
		<p><strong>Theme mode:</strong> <?php echo esc_html( wp_get_theme()->get( 'Name' ) ); ?> · <?php echo esc_html( $mode ); ?>.<br>
		<strong>Homepage:</strong> <?php echo ( $home && $front === $home->ID ) ? 'the C&amp;R Home page is the front page.' : 'not yet set to the C&amp;R Home page (use the button below).'; ?></p>

		<h2>Pages</h2>
		<table class="widefat striped" style="max-width:900px">
			<thead><tr><th>Page</th><th>Slug</th><th>Status</th><th>Template</th><th></th></tr></thead>
			<tbody>
			<?php foreach ( crlt_pages() as $slug => $meta ) :
				$p = get_page_by_path( $slug, OBJECT, 'page' );
				$t = $p ? get_page_template_slug( $p ) : '';
				$template_ok = in_array( $t, array( CRLT_TEMPLATE_CLASSIC, CRLT_TEMPLATE_BLOCK ), true );
				?>
				<tr>
					<td><?php echo esc_html( $meta['title'] ); ?></td>
					<td><code>/<?php echo esc_html( $slug ); ?>/</code></td>
					<td><?php echo $p ? ( 'publish' === $p->post_status ? 'Published' : esc_html( ucfirst( $p->post_status ) ) ) : '<span style="color:#b32d2e">Missing</span>'; ?></td>
					<td><?php echo $p ? ( $template_ok ? 'C&amp;R Blank Canvas' : '<span style="color:#b32d2e">Not set — edit the page and choose “C&amp;R Blank Canvas”</span>' ) : '—'; ?></td>
					<td><?php if ( $p ) : ?><a href="<?php echo esc_url( get_edit_post_link( $p->ID ) ); ?>">Edit</a> · <a href="<?php echo esc_url( get_permalink( $p->ID ) ); ?>" target="_blank" rel="noopener">View</a><?php endif; ?></td>
				</tr>
			<?php endforeach; ?>
			</tbody>
		</table>

		<h2>Actions</h2>
		<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" style="display:inline-block;margin-right:12px">
			<?php wp_nonce_field( 'crlt_admin' ); ?>
			<input type="hidden" name="action" value="crlt_admin"><input type="hidden" name="crlt_do" value="install">
			<?php submit_button( 'Create missing pages', 'primary', 'submit', false ); ?>
		</form>
		<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" style="display:inline-block;margin-right:12px" onsubmit="return confirm('This replaces the content of all C&R pages with the HTML bundled in the plugin. Any edits made in the WordPress editor will be lost. Continue?');">
			<?php wp_nonce_field( 'crlt_admin' ); ?>
			<input type="hidden" name="action" value="crlt_admin"><input type="hidden" name="crlt_do" value="reinstall">
			<?php submit_button( 'Reinstall page content from plugin files', 'secondary', 'submit', false ); ?>
		</form>
		<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" style="display:inline-block">
			<?php wp_nonce_field( 'crlt_admin' ); ?>
			<input type="hidden" name="action" value="crlt_admin"><input type="hidden" name="crlt_do" value="front">
			<?php submit_button( 'Set “Home” as the front page', 'secondary', 'submit', false ); ?>
		</form>

		<h2>Inquiry form</h2>
		<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>">
			<?php wp_nonce_field( 'crlt_admin' ); ?>
			<input type="hidden" name="action" value="crlt_admin"><input type="hidden" name="crlt_do" value="email">
			<p><label for="crlt_email">Send inquiries to</label><br>
			<input type="email" id="crlt_email" name="crlt_email" class="regular-text" value="<?php echo esc_attr( $email ); ?>" required></p>
			<p class="description">Every submission is also saved under <a href="<?php echo esc_url( admin_url( 'edit.php?post_type=cr_inquiry' ) ); ?>">Inquiries</a>, so nothing is lost if email delivery fails. For reliable delivery on Hostinger, install an SMTP plugin (see the deployment guide).</p>
			<?php submit_button( 'Save email' ); ?>
		</form>
	</div>
	<?php
}

add_action( 'admin_post_crlt_admin', 'crlt_handle_admin' );
function crlt_handle_admin() {
	if ( ! current_user_can( 'manage_options' ) ) {
		wp_die( 'Not allowed.' );
	}
	check_admin_referer( 'crlt_admin' );
	$do  = isset( $_POST['crlt_do'] ) ? sanitize_key( wp_unslash( $_POST['crlt_do'] ) ) : '';
	$msg = 'done';
	switch ( $do ) {
		case 'install':
			$r   = crlt_install_pages( false );
			$msg = 'pages-checked-' . count( array_keys( $r, 'created', true ) ) . '-created';
			break;
		case 'reinstall':
			$r   = crlt_install_pages( true );
			$msg = 'page-content-reinstalled-' . count( array_keys( $r, 'updated', true ) ) . '-updated';
			break;
		case 'front':
			$msg = crlt_set_front_page() ? 'home-is-now-the-front-page' : 'home-page-not-found-create-pages-first';
			break;
		case 'email':
			$email = isset( $_POST['crlt_email'] ) ? sanitize_email( wp_unslash( $_POST['crlt_email'] ) ) : '';
			if ( is_email( $email ) ) {
				update_option( 'crlt_inquiry_email', $email );
				$msg = 'inquiry-email-saved';
			} else {
				$msg = 'invalid-email';
			}
			break;
	}
	wp_safe_redirect( add_query_arg( array( 'page' => 'crlt', 'crlt_msg' => $msg ), admin_url( 'options-general.php' ) ) );
	exit;
}

/* -------------------------------------------------------------------------
 * 6. Inquiry form handler (public, honeypot + time-trap + rate limit)
 * ---------------------------------------------------------------------- */
add_action( 'init', 'crlt_register_inquiry_cpt' );
function crlt_register_inquiry_cpt() {
	register_post_type(
		'cr_inquiry',
		array(
			'label'               => 'Inquiries',
			'labels'              => array( 'name' => 'Inquiries', 'singular_name' => 'Inquiry', 'menu_name' => 'Inquiries' ),
			'public'              => false,
			'show_ui'             => true,
			'show_in_menu'        => true,
			'menu_icon'           => 'dashicons-email-alt',
			'supports'            => array( 'title', 'editor' ),
			'capability_type'     => 'post',
			'capabilities'        => array( 'create_posts' => 'do_not_allow' ),
			'map_meta_cap'        => true,
			'exclude_from_search' => true,
			'show_in_rest'        => false,
		)
	);
}

add_action( 'admin_post_nopriv_cr_inquiry', 'crlt_handle_inquiry' );
add_action( 'admin_post_cr_inquiry', 'crlt_handle_inquiry' );
function crlt_handle_inquiry() {
	$redirect = isset( $_POST['cr_redirect'] ) ? esc_url_raw( wp_unslash( $_POST['cr_redirect'] ) ) : '';
	$redirect = wp_validate_redirect( $redirect, home_url( '/' ) );
	$redirect = remove_query_arg( array( 'cr_sent', 'cr_error' ), $redirect );

	$fail = function ( $code ) use ( $redirect ) {
		wp_safe_redirect( add_query_arg( 'cr_error', $code, $redirect ) . '#inquiry' );
		exit;
	};

	// Honeypot + time trap (humans take longer than 3 seconds).
	if ( ! empty( $_POST['website'] ) ) {
		$fail( 'spam' );
	}
	$t = isset( $_POST['cr_t'] ) ? (int) $_POST['cr_t'] : 0;
	if ( $t && ( time() - $t ) < 3 ) {
		$fail( 'spam' );
	}
	// One submission per IP every 30 seconds.
	$ip  = isset( $_SERVER['REMOTE_ADDR'] ) ? sanitize_text_field( wp_unslash( $_SERVER['REMOTE_ADDR'] ) ) : '0';
	$key = 'crlt_rl_' . md5( $ip );
	if ( get_transient( $key ) ) {
		$fail( 'rate' );
	}
	set_transient( $key, 1, 30 );

	$field = function ( $name, $textarea = false ) {
		if ( ! isset( $_POST[ $name ] ) ) {
			return '';
		}
		$v = wp_unslash( $_POST[ $name ] );
		return $textarea ? sanitize_textarea_field( $v ) : sanitize_text_field( $v );
	};

	$name     = $field( 'name' );
	$email    = sanitize_email( $field( 'email' ) );
	$phone    = $field( 'phone' );
	$property = $field( 'property' );
	$subject  = $field( 'subject' );
	$dates    = $field( 'dates' );
	$guests   = $field( 'guests' );
	$message  = $field( 'message', true );

	if ( '' === $name || ! is_email( $email ) ) {
		$fail( 'invalid' );
	}
	if ( empty( $_POST['consent'] ) ) {
		$fail( 'consent' );
	}

	$lines = array(
		'Name:      ' . $name,
		'Email:     ' . $email,
		'Phone:     ' . ( $phone ? $phone : '—' ),
		'Subject:   ' . ( $subject ? $subject : 'General' ),
		'Property:  ' . ( $property ? $property : 'Not specified' ),
		'Dates:     ' . ( $dates ? $dates : '—' ),
		'Guests:    ' . ( $guests ? $guests : '—' ),
		'Sent from: ' . $redirect,
		'',
		'Message:',
		$message ? $message : '—',
	);
	$body = implode( "\n", $lines );

	// Save a copy in WordPress (Inquiries menu) before emailing.
	wp_insert_post(
		array(
			'post_type'    => 'cr_inquiry',
			'post_status'  => 'private',
			'post_title'   => sprintf( '%s — %s (%s)', $subject ? $subject : 'General', $name, wp_date( 'Y-m-d H:i' ) ),
			'post_content' => wp_slash( $body ),
		)
	);

	$to      = get_option( 'crlt_inquiry_email', get_option( 'admin_email' ) );
	$headers = array( 'Reply-To: ' . $name . ' <' . $email . '>' );
	$ok      = wp_mail( $to, sprintf( '[C&R Inquiry] %s — %s', $subject ? $subject : 'General', $name ), $body, $headers );
	if ( ! $ok ) {
		$fail( 'mail' );
	}
	wp_safe_redirect( add_query_arg( 'cr_sent', '1', $redirect ) . '#inquiry' );
	exit;
}
