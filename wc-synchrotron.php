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
			__( 'Synchrotron', 'wc-synchrotron' ),
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

		add_submenu_page(
			'wc-synchrotron',
			__( 'Tax Rates Test', 'wc-synchrotron' ),
			__( 'Tax Rates Test', 'wc-synchrotron' ),
			'manage_woocommerce',
			'wc-synchrotron-tax-rates',
			array( $this, 'display_tax_rates_screen' )
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

		wp_enqueue_style(
			'wc-synchrotron',
			plugins_url( 'dist/coupons.css', __FILE__ ),
			array()
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
				<div id="coupons_screen" class="wc-synchrotron">
				</div>
			</div>

			<script type='application/json' id='wc_coupon_screen_data'>
				<?php echo json_encode( $coupon_screen_data, JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_AMP ) ?>
			</script>
		<?php
	}

	/**
	 * Screen for managing tax rates.
	 */
	public function display_tax_rates_screen() {
		wp_enqueue_script(
			'wc-synchrotron-tax-rates',
			plugins_url( 'dist/tax_rates_bundle.js', __FILE__ ),
			array(),
			WC_Synchrotron::VERSION,
			true
		);

		wp_enqueue_style(
			'wc-synchrotron',
			plugins_url( 'dist/tax_rates.css', __FILE__ ),
			array()
		);

		wp_localize_script( 'wc-synchrotron-tax-rates', 'wc_tax_rates_screen_data', array(
			'endpoints' => array(
				'get_tax_rates' => esc_url_raw( rest_url( '/wc/v1/taxes' ) )
			),
			'nonce'     => wp_create_nonce( 'wp_rest' ),
			'strings'   => array(
				'tax_rates'         => __( 'Tax Rates', 'wc-synchrotron' ),
				'country_code'      => __( 'Country Code', 'wc-synchrotron' ),
				'state_code'        => __( 'State Code', 'wc-synchrotron' ),
				'postcode'          => __( 'ZIP/Postcode', 'wc-synchrotron' ),
				'city'              => __( 'City', 'wc-synchrotron' ),
				'rate'              => __( 'Rate %', 'wc-synchrotron' ),
				'tax_name'          => __( 'Tax Name', 'wc-synchrotron' ),
				'priority'          => __( 'Priority', 'wc-synchrotron' ),
				'compound'          => __( 'Compound', 'wc-synchrotron' ),
				'shipping'          => __( 'Shipping', 'wc-synchrotron' ),
				'country_code_hint' => __( 'A 2 digit country code, e.g. US. Leave blank to apply to all.', 'wc-synchrotron' ),
				'state_code_hint'   => __( 'A 2 digit state code, e.g. AL. Leave blank to apply to all.', 'wc-synchrotron' ),
				'postcode_hint'     => __( 'Postcode for this rule. Semi-colon (;) separate multiple values. Leave blank to apply to all areas. Wildcards (*) can be used. Ranges for numeric postcodes (e.g. 12345-12350) will be expanded into individual postcodes.', 'wc-synchrotron' ),
				'city_hint'         => __( 'Cities for this rule. Semi-colon (;) separate multiple values. Leave blank to apply to all cities.', 'wc-synchrotron' ),
				'rate_hint'         => __( 'Enter a tax rate (percentage) to 4 decimal places.', 'wc-synchrotron' ),
				'tax_name_hint'     => __( 'Enter a name for this tax rate.', 'wc-synchrotron' ),
				'priority_hint'     => __( 'Choose a priority for this tax rate. Only 1 matching rate per priority will be used. To define multiple tax rates for a single area you need to specify a different priority per rate.', 'wc-synchrotron' ),
				'compound_hint'     => __( 'Choose whether or not this is a compound rate. Compound tax rates are applied on top of other tax rates.', 'wc-synchrotron' ),
				'shipping_hint'     => __( 'Choose whether or not this tax rate also gets applied to shipping.', 'wc-synchrotron' ),
				'insert_row'        => __( 'Insert row', 'wc-synchrotron' ),
				'remove_rows'       => __( 'Remove selected row(s)', 'wc-synchrotron' ),
				'export_csv'        => __( 'Export CSV', 'wc-synchrotron' ),
				'import_csv'        => __( 'Import CSV', 'wc-synchrotron' ),
				'import_url'        => admin_url( 'admin.php?import=woocommerce_tax_rate_csv' ),
				'loading'           => __( 'Loading', 'wc-synchrotron' ),
				'tax_rate_id'       => __( 'Tax rate ID', 'wc-synchrotron' ),
			)
		) );

		echo '<div class="wrap woocommerce wc-synchrotron" id="tax_rates_screen"></div>';
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
