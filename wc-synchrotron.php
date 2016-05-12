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

	const VERSION        = '1.0.0';
	const WC_MIN_VERSION = '2.5';
	const TEXTDOMAIN     = 'woocommerce';

	/**
	 * Hook into plugins_loaded, which is when all plugins will be available.
	 *
	 * @since 1.0
	 */
	public function __construct() {
		include_once( 'dist/synchrotron-config.php' );

		add_action( 'plugins_loaded', array( $this, 'init' ) );
		add_action( 'wc_synchrotron_generate_translation_files', array( $this, 'generate_translation_files' ) );
	}

	/**
	 * Localisation
	 */
	public function load_plugin_textdomain() {
		load_plugin_textdomain( 'wc-synchrotron', false, trailingslashit( dirname( plugin_basename( __FILE__ ) ) ) . 'languages/' );
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
			add_filter( 'woocommerce_screen_ids', array( $this, 'register_screen_ids' ) );
			add_action( 'init', array( $this, 'load_plugin_textdomain' ) );
			add_action( 'admin_init', array( $this, 'maybe_generate_translation_files' ) );
		}
	}

	/**
	 * Queues PO to JSON conversion when needed.
	 */
	public function maybe_generate_translation_files() {
		$next_event = wp_next_scheduled( 'wc_synchrotron_generate_translation_files', array( get_locale() ) );
		$po_file    = $this->get_language_file_path( get_locale() );

		// We can only do conversion if the PO file exists and we don't want to queue this up twice.
		if ( file_exists( $po_file ) && ( ! $next_event || $next_event < time() ) ) {
			$translation_info = wp_get_pomo_file_data( $po_file );
			$revision         = strtotime( $translation_info['PO-Revision-Date'] );
			$json_file        = $this->get_language_file_path( get_locale(), 'json' );

			/**
			 * There are 2 case where we'd want to do a conversion;
			 *  - if the JSON file does not exist
			 *  - if the JSON file is out of date
			 */
			if ( ! file_exists( $json_file ) || $revision > get_option( 'synchrotron_revision_' . get_locale(), 0 ) ) {
				wp_schedule_single_event( time() + 10, 'wc_synchrotron_generate_translation_files', array( get_locale() ) );
			}
		}
	}

	/**
	 * Generates the translation files for a locale.
	 * @param  string $locale
	 */
	public function generate_translation_files( $locale = '' ) {
		$locale           = $locale ? $locale : get_locale();
		$po_file          = $this->get_language_file_path( $locale );
		$json_file        = $this->get_language_file_path( $locale, 'json' );
		$translation_info = wp_get_pomo_file_data( $po_file );
		$revision         = strtotime( $translation_info['PO-Revision-Date'] );

		// Parse PO file
		$po_data   = $this->parse_po_file( $po_file );

		// Convert entries to JSON
		$json      = $this->po2json( $po_data['headers'], $po_data['entries'], WC_Synchrotron::TEXTDOMAIN );

		// Write to file
		$this->create_json_file( $json, $json_file );

		// Record the revision and locale
		update_option( 'synchrotron_revision_' . $locale, $revision );
		wp_clear_scheduled_hook( 'wc_synchrotron_generate_translation_files', array( $locale ) );
	}

	/**
	 * Gets a language file path.
	 * @param  string $locale
	 * @param  string $type Filetype
	 * @return string
	 */
	protected function get_language_file_path( $locale, $type = 'po' ) {
		return trailingslashit( WP_LANG_DIR ) . 'plugins/' . WC_Synchrotron::TEXTDOMAIN . '-' . $locale . '.' . $type;
	}

	/**
	 * Parse a po file and get headers and entries.
	 * @param  string $po_file Path to po file
	 * @return array
	 */
	protected function parse_po_file( $po_file ) {
		include_once ABSPATH . WPINC . '/pomo/po.php';
		$po = new PO();
		$po->import_from_file( $po_file );
		return array(
			'headers' => $po->headers,
			'entries' => $po->entries,
		);
	}

	/**
	 * Converts PO file entries to Jed compatible JSON.
	 *
	 * Based on https://github.com/neam/php-po2json/blob/develop/Po2Json.php but
	 * adapted to work with entries from WP POMO class.
	 *
	 * @param array  $headers Array of headers from a PO file
	 * @param array  $translations Array of strings from a PO file
	 * @param string $textdomain Textdomain. Default ''
	 * @return string JSON
	 */
	protected function po2json( $headers, $translations, $textdomain = '' ) {
		$data = array(
			"domain"      => $textdomain,
			"locale_data" => array(
				$textdomain => array(
					'' => array(
						"domain"       => $textdomain,
						"plural_forms" => isset( $headers['Plural-Forms'] ) ? $headers['Plural-Forms'] : null,
					)
				),
			),
		);

		// Loop over parsed translations. Each translation will be of type
		// Translation_Entry. $translation_key contains a key, with context.
		foreach ( $translations as $translation_key => $translation ) {
			$entry = array();

			if ( $translation->is_plural ) {
				if ( 2 === sizeof( $translation->translations ) ) {
					$entry[0] = $translation->translations[1];
					$entry[1] = $translation->translations[0];
					$entry[2] = $translation->translations[1];
				} else {
					$entry    = $translation->translations;
				}
			} else {
				$entry[0] = null;
				$entry[1] = $translation->translations[0];
			}

			$data['locale_data'][ $textdomain ][ $translation_key ] = $entry;
		}

		return json_encode( $data );
	}

	/**
	 * Create JSON file.
	 * @param  string $json JSON data to write
	 * @param  string $file File path to write to.
	 */
	protected function create_json_file( $json, $file ) {
		if ( $file_handle = @fopen( $file, 'w' ) ) {
			fwrite( $file_handle, $json );
			fclose( $file_handle );
		}
	}

	/**
	 * Register Syncrotron screens for WooCommerce.
	 * @param  array $ids
	 * @return array
	 */
	public function register_screen_ids( $ids ) {
		$screen_id = sanitize_title( __( 'Synchrotron', 'wc-synchrotron' ) );
		$ids[] = 'toplevel_page_' . $screen_id;
		//$ids[] = $screen_id . '_page_wc-synchrotron-coupons';
		//$ids[] = $screen_id . '_page_wc-synchrotron-tax-rates';
		return $ids;
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
			__( 'Synchrotron', 'wc-synchrotron' ),
			__( 'Synchrotron', 'wc-synchrotron' ),
			'manage_woocommerce',
			'wc-synchrotron',
			array( $this, 'display_menu_screen' ),
			'dashicons-marker',
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
			'wc-synchrotron-coupons-js',
			$this->get_assets_url() . 'coupons_bundle.js',
			array(),
			$this->get_asset_version( 'coupons_bundle.js' ),
			true
		);

		wp_enqueue_style(
			'wc-synchrotron-coupons-css',
			$this->get_assets_url() . 'coupons.css',
			array(),
			$this->get_asset_version( 'coupons.css' )
		);

		$coupon_screen_data = apply_filters(
			'wc_coupon_screen_data',
			array(
				'endpoints'              => array(
					'get_coupons'   => esc_url_raw( rest_url( '/wc/v1/coupons' ) )
				),
				'nonce'                  => wp_create_nonce( 'wp_rest' ),
				'currency_symbol'        => html_entity_decode( get_woocommerce_currency_symbol() ),
				'currency_pos_is_prefix' => 'left' === substr( get_option( 'woocommerce_currency_pos', 'left' ), 0, 4 ),
			)
		);

		?>
			<div class="wrap">
			<h1><?php _e( 'Coupons', 'wc-synchrotron' ) ?></h1>
				<div id="coupons_screen" class="wc-synchrotron">
				</div>
			</div>

			<script type="application/json" id="wc_coupon_screen_data">
				<?php echo json_encode( $coupon_screen_data, JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_AMP ) ?>
			</script>
		<?php
	}

	/**
	 * Screen for managing tax rates.
	 */
	public function display_tax_rates_screen() {
		wp_enqueue_script(
			'wc-synchrotron-tax-rates-js',
			$this->get_assets_url() . 'tax_rates_bundle.js',
			array(),
			$this->get_asset_version( 'tax_rates_bundle.js' ),
			true
		);

		wp_enqueue_style(
			'wc-synchrotron-tax-rates-css',
			$this->get_assets_url() . 'tax_rates.css',
			array(),
			$this->get_asset_version( 'tax_rates.css' )
		);

		wp_localize_script( 'wc-synchrotron-tax-rates-js', 'wc_tax_rates_screen_data', array(
			'endpoints' => array(
				'taxes' => esc_url_raw( rest_url( '/wc/v1/taxes' ) ),
			),
			'nonce' => wp_create_nonce( 'wp_rest' ),
			'i18n'  => array(
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
				'save_changes'      => __( 'Save changes', 'wc-synchrotron' ),
			)
		) );

		echo '<div class="wrap woocommerce wc-synchrotron" id="tax_rates_screen"></div>';
	}

	/**
	 * Gets the base url for assets like .js and .css bundles
	 *
	 * @since 1.0
	 */
	public function get_assets_url() {
		if ( null !== WC_SYNCHROTRON_ASSETS_URL ) {
			if ( strstr( WC_SYNCHROTRON_ASSETS_URL, '//' ) ) {
				// It's a full URL, so just return it.
				return WC_SYNCHROTRON_ASSETS_URL;
			} else {
				// It's a relative url, so use plugin url as a base.
				return plugins_url( WC_SYNCHROTRON_ASSETS_URL, __FILE__ );
			}
		} else {
			// No assets url provided, so return base plugins url.
			return plugins_url( '/', __FILE__ );
		}
	}

	/**
	 * Gets the asset version for enqueuing purposes.
	 * If the config is set to bust caches, this returns a random hex string.
	 * If not, it returns the version of the plugin.
	 *
	 * @since 1.0
	 */
	public function get_asset_version( $script_name ) {
		if ( WC_SYNCHROTRON_BUST_ASSET_CACHE ) {
			require_once( ABSPATH . 'wp-includes/class-phpass.php' );
			$hasher = new PasswordHash( 8, false );
			return md5( $hasher->get_random_bytes( 16 ) );
		} else {
			return WC_Synchrotron::VERSION;
		}
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
