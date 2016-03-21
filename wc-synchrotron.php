<?php
/**
 * Plugin Name: WooCommerce Synchrotron
 * Plugin URI: https://github.com/Automattic/wc-synchrotron
 * Description: The new JavaScript and API powered interface for WooCommerce
 * Version: 1.0.0-dev
 * Author: Automattic
 * Author URI: http://woothemes.com
 * Requires at least: 4.4
 * Tested up to: 4.4
 *
 * Text Domain: wc-synchrotron
 * Domain Path: /i18n/languages/
 *
 * @package WC_Synchrotron
 * @category Core
 * @author Automattic
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
	 * Hook into plugins_loaded, which is when all plugins will be available.
	 *
	 * @since 1.0
	 */
	public function __construct() {
		add_action( 'plugins_loaded', array( $this, 'init' ) );
	}

	/**
	 * Hooks in the Synchrotron plugin if supported, otherwise hooks in admin notices only.
	 *
	 * @since 1.0
	 */
	public function init() {
		if ( $this->check_dependencies() ) {
			// Hooks and filters for WC Synchrotron should be added here.
			add_action( 'admin_menu', array( $this, 'attach_menus' ) );
		}
	}

	/**
	 * Checks if the WooCommerce plugin is active.
	 * Note: Must be run after the "plugins_loaded" action fires.
	 *
	 * @since 1.0
	 * @return bool
	 */
	public function is_woocommerce_active() {
		return class_exists( 'woocommerce' );
	}

	/**
	 * Checks if the current WooCommerce version is supported.
	 * Note: Must be run after the "plugins_loaded" action fires.
	 *
	 * @since 1.0
	 * @return bool
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

		$coupon_screen_data = apply_filters(
			'wc_coupon_screen_data',
			array(
				'endpoints' => array(
					'get_coupons' => esc_url_raw( rest_url( '/wc/v1/coupons' ) )
				),
				'nonce' => wp_create_nonce( 'wp_rest' )
			)
		);

		?>
			<div class="wrap">
			<h1><?php _e( 'Coupons', 'wc-synchrotron' ) ?></h1>
				<div id="coupons_screen">
				</div>
			</div>

			<script type='application/json' id='wc_coupon_screen_data'>
				<?php echo json_encode( $coupon_screen_data, JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_AMP ) ?>
			</script>
		<?php
	}

	/**
	 * Checks that WooCommerce is loaded before doing anything else.
	 *
	 * @since 1.0
	 * @return bool True if supported
	 */
	private function check_dependencies() {
		$dependencies = array(
			'wc_installed' => array(
				'callback'        => array( $this, 'is_woocommerce_active' ),
				'notice_callback' => array( $this, 'woocommerce_inactive_notice' ),
			),
			'wc_minimum_version' => array(
				'callback'        => array( $this, 'is_woocommerce_version_supported' ),
				'notice_callback' => array( $this, 'woocommerce_wrong_version_notice' ),
			)
		);

		foreach ( $dependencies as $check ) {
			if ( ! call_user_func( $check['callback'] ) ) {
				add_action( 'admin_notices', $check['notice_callback'] );
				return false;
			}
		}

		return true;
	}

	/**
	 * WC inactive notice.
	 * @since  1.0.0
	 * @return string
	 */
	public function woocommerce_inactive_notice() {
		if ( current_user_can( 'activate_plugins' ) ) {
			echo '<div class="error"><p><strong>' . __( 'WooCommerce Synchrotron is inactive.', 'wc-synchrotron' ) . '</strong> ' . sprintf( __( 'The WooCommerce plugin must be active for WC Synchrotron to work. %sPlease install and activate WooCommerce%s.', 'wc-synchrotron' ), '<a href="' .esc_url( admin_url( 'plugins.php' ) ) . '">', '</a>' ) . '</p></div>';
		}
	}

	/**
	 * Wrong version notice.
	 * @since  1.0.0
	 * @return string
	 */
	public function woocommerce_wrong_version_notice() {
		if ( current_user_can( 'activate_plugins' ) ) {
			echo '<div class="error"><p><strong>' . __( 'WooCommerce Synchrotron is inactive.', 'wc-synchrotron' ) . '</strong> ' . sprintf( __( 'The WooCommerce plugin must be at least version %s for WC Synchrotron to work. %sPlease upgrade WooCommerce%s.', 'wc-synchrotron' ), WC_Synchrotron::WC_MIN_VERSION, '<a href="' . esc_url( admin_url( 'plugins.php' ) ) . '">', '</a>' ) . '</p></div>';
		}
	}
}

return new WC_Synchrotron();
