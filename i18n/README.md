# WooCommerce Synchrotron i18n

The way Internationalization works in Synchrotron is by generating translation files,
then serving them up to the React client for use.

***TL;DR: Just run*** `npm run build-strings` ***after changing any strings and commit the .pot file. The rest should "just work"***

## Step 1: PHP Strings Files

Since the view layer of Synchrotron lies in React, almost all text strings are in React as well.
In order to use the normal WordPress utilities for gettext, these strings need to be in a format the tools understand.
To that end, this project uses the [Calypso server i18n](https://github.com/Automattic/wp-calypso/tree/master/server/i18n)
parser to generate a PHP file with strings it finds in translate calls in the JavaScript files.

## Step 2: makepot

From here, the generated PHP file can be parsed by the grunt-wp-i18n utility to make the .pot file.
The .pot file is saved under i18n/languages, and checked in to source control for GlotPress compatibility.

### Build it!

To run Step 1 and 2 of this process, simply run `npm run build-strings` and it will parse the translate calls into a .pot file.
Please only do this if you have actual changes to the strings. Note that every time you do this, it will change the timestamp,
so it will show a diff in git even if you haven't changed any strings. Be sure to run `git diff` on the .pot file before
you commit it to ensure you've actually changed the strings.

## Step 3: Normal translation process

From here, the normal translation process can take over (GlotPress or other translation options).
The Synchrotron plugin will look for its .po files in the wp-content/languages/plugins directory like any conventional plugin.

## Step 4: .po to JSON Conversion

Synchrotron needs the translations in a specialized JSON format, so it will convert .po files downloaded by WordPress into
those files on-demand. After the .po files are in place on your server, every time a user accesses wp-admin,
Synchrotron will check for an updated translation. If there is one, it will start an async task of parsing the .po file
into a .js file that contains the translations.

## Step 5: JSON to the Client

When a user accesses a Synchrotron page, the correct .js translation file is enqueued on the page, versioned by its
translation timestamp. This allows browsers to cache the translation file, but busts the cache when a translation is
updated. From here, the client initializes the [Calypso i18n module](https://www.npmjs.com/package/i18n-calypso)
with the JSON translation data. Synchrotron uses the 'localize' Higher Order Component approach to using the i18n-calypso package.
