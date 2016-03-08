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
 * Text Domain: wc-synchrotron
 * Domain Path: /i18n/languages/
 *
 * @package WC_Synchrotron
 * @category Core
 * @author WooThemes
 */
defined( 'ABSPATH' ) or die( 'No direct access.' );

/**
 * Main class.
 *
 * @since 1.0
 */
class WC_Synchrotron {

	const VERSION = '1.0.0';
	const WC_MIN_VERSION = '2.5';

	/**
	 * Set up class including hooks and filters.
	 *
	 * @since 1.0
	 */
	public function __construct() {
		add_action( 'plugins_loaded', array( $this, 'check_dependencies' ) );
		add_action( 'admin_menu', array( $this, 'attach_menus' ) );
	}

	/**
	 * Checks if the WooCommerce plugin is active.
	 * Note: Must be run after the "plugins_loaded" action fires.
	 *
	 * @since 1.0
	 */
	public function is_woocommerce_active() {
		return class_exists( 'woocommerce' );
	}

	/**
	 * Checks if the current WooCommerce version is supported.
	 * Note: Must be run after the "plugins_loaded" action fires.
	 *
	 * @since 1.0
	 */
	public function is_woocommerce_version_ok() {
		return version_compare(
			get_option( 'woocommerce_db_version' ),
			WC_Synchrotron::WC_MIN_VERSION,
			'>='
		);
	}

	/**
	 * Checks if all dependencies are okay for us to run.
	 *
	 * @since 1.0
	 */
	public function are_dependencies_ok() {
		return $this->is_woocommerce_active() &&
		       $this->is_woocommerce_version_ok();
	}

	/**
	 * Attaches a top-level admin menu for WooCommerce Synchrotron.
	 *
	 * @since 1.0
	 */
	public function attach_menus() {
		add_menu_page(
			__( 'WooCommerce Synchrotron', 'wc-synchrotron' ),
			__( 'Synchrotron Admin', 'wc-synchrotron' ),
			'manage_woocommerce',
			'wc-synchrotron',
			array( $this, 'display_menu_screen' ),
			null,
			56
		);

		// Only add the submenus if we're good to go.
		if ( $this->are_dependencies_ok() ) {
			add_submenu_page(
				'wc-synchrotron',
				__( 'WooCommerce Coupons', 'wc-synchrotron' ),
				__( 'Coupons', 'wc-synchrotron' ),
				'manage_woocommerce',
				'wc-synchrotron-coupons',
				array( $this, 'display_coupons_screen' )
			);
		}
	}

	/**
	 * Display screen for main Synchrotron menu.
	 *
	 * @since 1.0
	 */
	public function display_menu_screen() {
		if ( ! $this->are_dependencies_ok() ) {
			$this->display_inactive_screen_dependencies();
			return;
		}

		?>
			<div class="wrap">
				<h1><?php _e( 'WooCommerce Synchrotron Admin', 'wc-synchrotron' ) ?></h1>
				<p>
					(Placeholder: Synchrotron Main Screen)
				</p>
			</div>
		<?php
	}

	/**
	 * Display screen for coupons.
	 *
	 * @since 1.0
	 */
	public function display_coupons_screen() {
		if ( ! $this->are_dependencies_ok() ) {
			$this->display_inactive_screen_dependencies();
			return;
		}

		wp_enqueue_script(
			'wc-synchrotron-coupons',
			plugins_url( 'dist/coupons_bundle.js', __FILE__ ),
			array(),
			WC_Synchrotron::VERSION,
			true
		);

		?>
			<div class="wrap">
			<h1><?php _e( 'Coupons', 'wc-synchrotron' ) ?></h1>
				<div id="coupons_screen">
				</div>
			</div>
		<?php
	}

	/**
	 * Checks that WooCommerce is loaded before doing anything else.
	 *
	 * @since 1.0
	 */
	public function check_dependencies() {
		if ( ! $this->are_dependencies_ok() ) {
			add_action( 'admin_notices', array( $this, 'admin_notice_dependencies' ) );
		}
	}

	/**
	 * Called when this plugin's dependencies are not met.
	 * It displays an admin notice for those users who can do something about it.
	 *
	 * @since 1.0
	 */
	public function admin_notice_dependencies() {
		if ( ! $this->is_woocommerce_active() ) {
			$this->display_admin_woocommerce_inactive();

		} elseif ( ! $this->is_woocommerce_version_ok() ) {
			$this->display_admin_woocommerce_wrong_version();
		}
	}

	private function display_admin_woocommerce_inactive() {
		$wc_url = 'http://wordpress.org/extend/plugins/woocommerce/';
		$plugins_url = esc_url( admin_url( 'plugins.php' ) );

		?>
		<div id="message" class="error">
			<p>
				<strong><?php _e( 'WooCommerce Synchrotron is inactive.', 'wc-synchrotron' ) ?></strong>
				<?php if ( current_user_can( 'activate_plugins' ) ) {
					printf( '<a href="%s">%s</a> %s ',
						$wc_url,
						__( 'The WooCommerce plugin', 'wc-synchrotron' ),
						__( 'must be active for WooCommerce Synchrotron to work.', 'wc-synchrotron' )
					);

					printf( '<a href="%s">%s &raquo;</a> ',
						$plugins_url,
						__( 'Please Install and Activate WooCommerce', 'wc-synchrotron' )
					);
				} else {
					_e( 'Please contact your administrator to check the site plugins.', 'wc-synchrotron' );
				} ?>
			</p>
		</div>

		<?php
	}

	private function display_admin_woocommerce_wrong_version() {
		$wc_url = 'http://wordpress.org/extend/plugins/woocommerce/';
		$plugins_url = esc_url( admin_url( 'plugins.php' ) );

		?>
		<div id="message" class="error">
			<p>
				<strong>WooCommerce Synchrotron is inactive.</strong>
				<?php if ( current_user_can( 'activate_plugins' ) ) {
					printf( '<a href="%s">%s</a> ',
						$wc_url,
						__( 'The WooCommerce plugin', 'wc-synchrotron' )
					);
					printf(
						__( 'must be at least version %1$s for WooCommerce Synchrotron to work', 'wc-synchrotron' ),
						WC_Synchrotron::WC_MIN_VERSION
					);
					printf( '</a> ' );

					printf( '<a href="%s">%s &raquo;</a> ',
						$plugins_url,
						__( 'Update WooCommerce' )
					);
				} else {
					_e( 'Please contact your administrator to check the site plugins.', 'wc-synchrotron' );
				} ?>
			</p>
		</div>

		<?php
	}

	private function display_inactive_screen_dependencies() {
		$plugins_url = esc_url( admin_url( 'plugins.php' ) );

		?>
		<div class="wrap">
			<h3>WooCommerce Synchrotron is inactive.</h3>
			<p>
				There's something Sychrotron needs to run that isn't quite right.
			</p>
			<p>
				<?php if ( current_user_can( 'activate_plugins' ) ) {
					printf( '<a href="%s">%s &raquo;</a> ',
						$plugins_url,
						__( 'Please check the plugins page', 'wc-synchrotron' )
					);
				} else {
					_e( 'Please contact your administrator to check the site plugins.', 'wc-synchrotron' );
				} ?>
			</p>
		</div>
		<?php
	}
}

return new WC_Synchrotron();

