<?php
/**
 * Template Name: C&R Blank Canvas
 *
 * Blank, full-bleed canvas used by the C&R Luxurious Travel pages on classic
 * themes. The page content (one Custom HTML block) is printed with no theme
 * header, footer, title or wrappers. Theme styles still load through wp_head(),
 * but every C&R rule is scoped to the .cr wrapper, so nothing clashes.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?><!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
<meta charset="<?php bloginfo( 'charset' ); ?>">
<meta name="viewport" content="width=device-width, initial-scale=1">
<?php wp_head(); ?>
</head>
<body <?php body_class( 'cr-body' ); ?>>
<?php wp_body_open(); ?>
<?php
while ( have_posts() ) {
	the_post();
	the_content();
}
wp_footer();
?>
</body>
</html>
