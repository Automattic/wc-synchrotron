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

	private $errors = [];

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
	public function is_woocommerce_version_supported() {
		return version_compare(
			get_option( 'woocommerce_db_version' ),
			WC_Synchrotron::WC_MIN_VERSION,
			'>='
		);
	}

	/**
	 * Attaches a top-level admin menu for WooCommerce Synchrotron.
	 *
	 * @since 1.0
	 */
	public function attach_menus() {
		// Only add menus if WC is usable.
		if ( $this->is_woocommerce_active() &&
		     $this->is_woocommerce_version_supported() ) {

			add_menu_page(
				__( 'WooCommerce Synchrotron', 'wc-synchrotron' ),
				__( 'Synchrotron Admin', 'wc-synchrotron' ),
				'manage_woocommerce',
				'wc-synchrotron',
				array( $this, 'display_menu_screen' ),
				null,
				56
			);

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
		$wc_errors = $this->get_woocommerce_error_messages( current_user_can( 'activate_plugins' ) );
		$this->errors = $this->errors + $wc_errors;

		if ( $this->errors ) {
			add_action( 'admin_notices', array( $this, 'display_admin_notices' ) );
		}
	}

	/**
	 * Displays any active admin notices for this plugin.
	 * This function should be hooked to the admin_notices event.
	 *
	 * @since 1.0
	 */
	public function display_admin_notices() {
		if ( $this->errors ) {
			?>
				<div id="message" class="error">
					<strong><?php _e( 'WooCommerce Synchrotron is inactive.', 'wc-synchrotron' ) ?></strong>
					<?php foreach( $this->errors as $error ) { ?>
						<p>
							<?php echo $error ?>
						</p>
					<?php } ?>
				</div>
			<?php
		}
	}

	private function get_woocommerce_error_messages( $can_activate_plugins ) {
		$errors = [];

		if ( ! $this->is_woocommerce_active() ) {
			$errors[] = $this->get_error_woocommerce_inactive( $can_activate_plugins );

		} elseif ( ! $this->is_woocommerce_version_supported() ) {
			$errors[] = $this->get_error_woocommerce_wrong_version( $can_activate_plugins );
		}

		return $errors;
	}

	private function get_error_woocommerce_inactive( $can_activate_plugins ) {
		$wc_url = 'http://wordpress.org/extend/plugins/woocommerce/';
		$plugins_url = esc_url( admin_url( 'plugins.php' ) );

		if ( $can_activate_plugins ) {
			return
				'<a href="' . $wc_url . '">' .
				__( 'The WooCommerce plugin', 'wc-synchrotron' ) . ' ' .
				'</a>' .
				__( 'must be at active', 'wc-synchrotron' ) . ' ' .
				__( 'for WooCommerce Synchrotron to work.', 'wc-synchrotron' ) .  ' ' .
				'<a href="' . $plugins_url . '">' .
				__( 'Please Install and Activate WooCommerce', 'wc-synchrotron' ) . ' &raquo;' .
				'</a>';
		} else {
			return __( 'Please contact your administrator to check the site plugins.', 'wc-synchrotron' );
		}
	}

	private function get_error_woocommerce_wrong_version( $can_activate_plugins ) {
		$wc_url = 'http://wordpress.org/extend/plugins/woocommerce/';
		$plugins_url = esc_url( admin_url( 'plugins.php' ) );

		if ( $can_activate_plugins ) {
			return
				'<a href="' . $wc_url . '">' .
				__( 'The WooCommerce plugin', 'wc-synchrotron' ) . ' ' .
				'</a> ' .
				__( 'must be at least version', 'wc-synchrotron' ) . ' ' .
				WC_Synchrotron::WC_MIN_VERSION . ' ' .
				__( 'for WooCommerce Synchrotron to work.', 'wc-synchrotron' ) .  ' ' .
				'<a href="' . $plugins_url . '">' .
				__( 'Update WooCommerce' ) . ' &raquo;' .
				'</a>';
		} else {
			return __( 'Please contact your administrator to check the site plugins.', 'wc-synchrotron' );
		}
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

