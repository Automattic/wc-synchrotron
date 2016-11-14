fetch-data
==========

This is a utility that fetches data from an API and caches it in redux state.
It allows use of fetched data from multiple React components and will
automatically fetch the data the first time a component receives props.

#### How it works:

`fetch-data` keeps track of `fetch` objects to cache their data and fetch from
their APIs when needed. React components can then use a Higher Order Component (HOC)
to add the fetched data to themselves as a property.

##### The `fetch` object.

A `fetch` object is defined as such:

```js
{
  service: 'my-api',
  key: '/my/api/endpoint?query=abc',
  defaultValue: [],
  shouldUpdate: ( fetch, data ) => {  },
  action: ( state ) => fetchAction( service, key, url, params ),
}
```

* `service` is a unique string identifier for the api (e.g. 'wp-api')
* `key` is a unique string identifier for the fetched data (must include anything that could change the data, e.g. query parameters)
* `defaultValue` is the value given to props when the fetch data isn't available
* `shouldUpdate` is a `function( fetch, data )` that returns true if the fetch should be updated
* `action` is a `function( state )` that returns a redux action. `fetchAction` should be used to create this action.
This will handle both successful and error results from the fetch, and update the `fetch-data` cache state in redux accordingly.

The following `updateWhen` helper functions are available for `shouldUpdate`. See below for an example.
* `notPresent()` - Simply checks if the fetch data is available yet or not.

#### How to use:

1. Create a function that returns a `fetch` object. This can be done in your own
API file to keep all the `fetch` objects together.

Note: The `params` of `fetchAction` match the `init` params of the [HTTP fetch
interface](https://developer.mozilla.org/en-US/docs/Web/API/GlobalFetch/fetch)

```js
import { fetchAction, updateWhen } from 'fetch-data';

function fetchApiData( queryString ) {
  const baseUrl = 'http://my.api';
  const endpoint = '/my/api/endpoint/';
  const fullUrl = baseUrl + endpoint + queryString;
  const params = {
    method: 'GET',
    headers: new Headers( { x-custom-value: 'true' } );
  };

  const service = 'my-api';
  const key = endpoint + queryString;

  return {
    service,
    key,
    defaultValue: [],
    shouldUpdate: updateWhen.notPresent(),
    action: ( state ) => fetchAction( service, key, fullUrl, params );
  };
}
```

2. From your React Component, use `mapFetchProps` and `fetchConnect` to create a Higher Order Component to use the `fetch` you've created.

```js
import { fetchConnect } from 'fetch-data';

function mapFetchProps( props ) {
  const { apiQuery } = props;

  return {
    myApiData: fetchApiData( apiQuery ),
  };
}

export default fetchConnect( mapFetchProps )( myReactComponent );
```

By doing this, the react component will gain a property called `myApiData` that
will be set to the current cached state of the fetched data, or to `defaultValue`
if the fetched data is not available. When the data becomes fetched, this component
will update with the new value in its props.

