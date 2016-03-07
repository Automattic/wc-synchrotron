<?php
/**
 * Plugin Name: WooCommerce Synchrotron
 * Plugin URI: https://github.com/Automattic/wc-synchrotron
 * Description: The new JavaScript and API powered interface for WooCommerce
 * Version: 1.0.0-dev
 * Author: WooThemes
 * Author URI: http://woothemes.com
 * Requires at least: 4.4
 * Tested up to: 4.4
 *
 * @package WC_Synchrotron
 * @category Core
 * @author WooThemes
 */
defined( 'ABSPATH' ) or die( 'No direct access.' );

/**
 * Required functions
 */
if ( ! function_exists( 'is_woocommerce_active' ) ) {
	require_once( 'woo-includes/woo-functions.php' );
}

/**
 * Check if WooCommerce is active and the right version. If not, disable.
 */
if ( ! is_woocommerce_active() ||
	  version_compare( get_option( 'woocommerce_db_version' ), WC_Synchrotron::WC_MIN_VERSION, '<' ) ) {
	add_action( 'admin_notices', 'WC_Synchrotron::woocommerce_inactive_notice' );
}

/**
 * Main class.
 *
 * @since 1.0
 */
class WC_Synchrotron {

	const VERSION = '1.0.0';
	const WC_MIN_VERSION = '2.3';

	/**
	 * Set up class including hooks and filters.
	 *
	 * @since 1.0
	 */
	public static function init() {
		add_action( 'admin_menu', __CLASS__ . '::attach_menu' );
	}

	/**
	 * Attaches a top-level admin menu for WooCommerce Synchrotron.
	 *
	 * @since 1.0
	 */
	public static function attach_menu() {
		add_menu_page(
			'WooCommerce Synchrotron',
			'Synchrotron Admin',
			'manage_options',
			'wc-synchrotron',
			__CLASS__ . '::display_menu_page'
		);
	}

	/**
	 * Display page for submenu.
	 *
	 * @since 1.0
	 */
	public static function display_menu_page() {
?>
		<div class='wrap'>
			<h1>WooCommerce Synchrotron Admin</h1>
			<p>
				This is a placeholder for much greater things.
			</p>
		</div>
<?php
	}

	/**
	 * Called when WooCommerce is inactive or unusable.
	 *
	 * @since 1.0
	 */
	public static function woocommerce_inactive_notice() {
			if (current_user_can( 'activate_plugins' ) && is_woocommerce-active() ) {
?>
				<div id'message' class='error'>
					<p><strong>WooCommerce Synchrotron is inactive.</strong></p>
					<p>
						The <a href='http://wordpress.org/extend/plugins/woocommerce/'>WooCommerce plugin</a>
						must be active for the WooCommerce Synchrotron plugin to work.
					</p>
					<p>
						Please <a href='<?php esc_url( admin_url( 'plugins.php' ) ) ?>'>Install &amp; activate WooCommerce &raquo;</a>
					</p>
				</div>
<?php
			}
	}
}

WC_Synchrotron::init();

