[GitHub Repository](https://github.com/Andreserl2504/Snag-query)

# HOW FETCH

Create a new object `Snag` and write the general config for that object.
``` ts
const snag = new Snag({
	URL: 'https://pokeapi.co/api/v2/',
	header: 'JSON'
})
```
NOTE: Currently, the `header` property only accepts `'JSON'` value.
The `URL` property can be undefined.

### Without config
``` ts
const snag = new Snag({})
```

The Snag object will return 3 methods to make the fetch you want.

## getSnag()
This makes just one fetch with `GET` method and returns an object with `data` value and method to refetch the same data if you need.

### Params

`path`: Write the path of the URL configured in object Snag or URL to make a fetch (URL has priority over path).

`format`: Receive a callback to return the shape of the object.


``` ts
const { data, refetch } = snag.getSnag<ValueWillReturnType>({
path: 'pokemon/ditto'
format: (pokemon: JSONFormAPIType) => {
	return {
		name: pokemon.name,
		id: pokemon.id
	}
} 
})
```
This will return

``` ts
{ 
	name: 'ditto',
	id: 132 
}
```

If you want the whole JSON, keep the format param empty.

NOTE: This method have a property `header` too.

## getSnags()

The difference with `getSnag()` method is that you can make much fetch at once.

### Params

`paths`: Receive an `Array` with paths of the base URL of the object, it's works like `path` param from `getSnag()` method.

`format`: Receive a callback to return the shape of the objects that will be within an `Array`.

`createPathsFn`: if you don't have an `Array` with paths within, you can create it in this param.

``` ts
const { data, refetch } = snag.getSnags<ValueWillReturnType>({
paths: ['/pokemon/1','/pokemon/4','/pokemon/7'],
format: (pokemon: JSONFormAPIType) => {
	return {
		name: pokemon.name,
		id: pokemon.id
	}
}
})
```

This will return

``` ts
[
	{
		name: 'bulbasaur',
		id: 1
	},
	{
		name: 'charmander',
		id: 4
	},
	{
		name: 'squirtle',
		id: 7
	}
]
```

Or You can try it too

``` ts

const { data, refetch } = snag.getSnags<ValueWillReturnType>({
	format: (pokemon: JSONFormAPIType) => {
		return {
			name: pokemon.name,
			id: pokemon.id
		}
	}
	createPathsFn: () => {
		return Array.from({lenght: 3}, (_,i) => {
			return `/pokemon/${i}`
		})
	}
})
```
This will return

``` ts
[
	{
		name: 'bulbasaur',
		id: 1
	},
	{
		name: 'ivysaur',
		id: 2
	},
	{
		name: 'venusaur',
		id: 3
	}
]
```

If you want the whole JSON, keep the format param empty.

NOTE: This method have a property `header` too.

## mutateSnag()

The method `mutateSnag()` can fetch with others methods (`POST`,  `PATCH`, `PUT`, `DELETE`) and can receive a body, but works a bit different, It return an object that contain another method. With this you can make the fetch.

### mutateSnag() params

`path`: Write the path of the URL configured in object Snag or URL to make a fetch (URL has priority over path).

`method`: The method of fetching you have to do (`POST`,  `PATCH`, `PUT`, `DELETE`), the default value is `POST`.

NOTE: This method have a property `header` too.

### mutate() Params

`format`: This receive a callback to return the shape of the object.

`body`: Body of query, there's no need to use `JSON.stringify()`

``` ts
const btn = document.querySelector('.btn')

const snag = new Snag({
	URL: 'https://reqres.in/'
	header: 'JSON'
})
const snagMutation = snag.mutateSnag<ValueWillReturnType>({
	path: '/api/users'
	})
	
btn.addEventListener('click', () => {
	const queryResult = snagMutation.mutate({
		body: {
		    name: "midudev",
		    job: "web developer"
		}
		format: (obj: JSONFormAPIType) => {
			name: obj.name
		}
	})
})
```
This will return
``` ts
{
	name: 'midudev'
}
```
If you want the whole JSON, keep the format param empty.

#

**Snag-query is in beta version**