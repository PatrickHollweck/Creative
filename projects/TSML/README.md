# TSML

[![Build Status](https://travis-ci.org/FetzenRndy/TSML.svg?branch=master)](https://travis-ci.org/FetzenRndy/TSML)

TypeScriptMarkupLanguage is an attempt to make a type-safe html template engine.

### Vision

If you have a nice backend system written in a language like Typescript, using a template
engine can be a pain. You loose all benefits of a typed language, like compile-time checking.

TSML is an attempt to make a transpiler that is interoperable with typescript. Its main goals are:

-   Compile time checking of types.
-   Full interopability with typescript.
-   Provide a elegant syntax for templates.

#### How it could look like.

> WARNING: Everything you see is still a concept!

First you would create a TSML template, which could look like this:

```haml
@templateModelType = string[]

doctype:5
%html
	%head
		%title Hello World
		%meta(key="author" content="patrick-hollweck")
	%body(class="container")
		@for name of names
			%div(class="card")
				%h1 Hello @{name}
```

Then you would invoke the "TSML Compiler" from typescript.

```ts
const compiledTemplate = TSML.compile<string[]>("./template.tsml", ["Kevin", "Mark"]);
console.log(compiledTemplate);
```

The compiled template would then look like this

```html
<!DOCTYPE html>
<html>
	<head>
		<title>Hello World</title>
		<meta key="author" content="patrick-hollweck">
	</head>
	<body class="container">
		<div class="card">
			<h1>Kevin</h1>
		</div>
		<div class="card">
			<h1>Mark</h1>
		</div>
	</body>
</html>
```
