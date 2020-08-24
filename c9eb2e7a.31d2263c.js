(window.webpackJsonp=window.webpackJsonp||[]).push([[112],{171:function(e,t,n){"use strict";n.r(t),n.d(t,"frontMatter",(function(){return i})),n.d(t,"metadata",(function(){return s})),n.d(t,"rightToc",(function(){return c})),n.d(t,"default",(function(){return h}));var a=n(2),r=n(6),o=(n(0),n(198)),i={id:"stitch-combining-schemas",title:"Combining multiple schemas",sidebar_label:"Combining schemas"},s={unversionedId:"stitch-combining-schemas",id:"stitch-combining-schemas",isDocsHomePage:!1,title:"Combining multiple schemas",description:"Schema stitching is the process of creating a single GraphQL schema from multiple underlying GraphQL APIs.",source:"@site/docs/stitch-combining-schemas.md",permalink:"/docs/stitch-combining-schemas",editUrl:"https://github.com/ardatan/graphql-tools/edit/master/website/docs/stitch-combining-schemas.md",sidebar_label:"Combining schemas",sidebar:"someSidebar",previous:{title:"GraphQLSchema merging",permalink:"/docs/merge-schemas"},next:{title:"Extending stitched schemas",permalink:"/docs/stitch-schema-extensions"}},c=[{value:"Getting started",id:"getting-started",children:[]},{value:"Subschema Configs",id:"subschema-configs",children:[]},{value:"Stitching remote schemas",id:"stitching-remote-schemas",children:[]},{value:"Duplicate type definitions",id:"duplicate-type-definitions",children:[]},{value:"Adding transforms",id:"adding-transforms",children:[]}],m={rightToc:c};function h(e){var t=e.components,n=Object(r.a)(e,["components"]);return Object(o.b)("wrapper",Object(a.a)({},m,n,{components:t,mdxType:"MDXLayout"}),Object(o.b)("p",null,"Schema stitching is the process of creating a single GraphQL schema from multiple underlying GraphQL APIs."),Object(o.b)("p",null,"One of the main benefits of GraphQL is that we can query for all of our data as part of one schema, and get everything we need in a single request. As the schema grows though, it may become cumbersome to manage it all as one codebase. It may be preferable to split the schema into seperate modules or microservices that can be developed and deployed independently. We may also want to integrate our own schema with third-party schemas."),Object(o.b)("p",null,"In these cases, we use ",Object(o.b)("inlineCode",{parentName:"p"},"stitchSchemas")," to combine multiple GraphQL schemas together into one unified gateway schema that knows how to delegate parts of the query to the relevant underlying subschemas. These subschemas can be local GraphQL instances or APIs running on a remote server. They can even be third-party services, allowing us to create mashups with external data."),Object(o.b)("h2",{id:"getting-started"},"Getting started"),Object(o.b)("p",null,"In this example we'll stitch together two very simple schemas. We'll be dealing with a system of users and \"chirps\"","\u2014","or, small snippets of text that users can post."),Object(o.b)("pre",null,Object(o.b)("code",Object(a.a)({parentName:"pre"},{className:"language-js"}),"import { makeExecutableSchema } from '@graphql-tools/schema';\nimport { addMocksToSchema } from '@graphql-tools/mock';\nimport { stitchSchemas } from '@graphql-tools/stitch';\n\nlet chirpSchema = makeExecutableSchema({\n  typeDefs: `\n    type Chirp {\n      id: ID!\n      text: String\n      authorId: ID!\n    }\n\n    type Query {\n      chirpById(id: ID!): Chirp\n      chirpsByAuthorId(authorId: ID!): [Chirp]!\n    }\n  `\n});\n\nlet authorSchema = makeExecutableSchema({\n  typeDefs: `\n    type User {\n      id: ID!\n      email: String\n    }\n\n    type Query {\n      userById(id: ID!): User\n    }\n  `\n});\n\n// just mock the schemas for now to make them return dummy data\nchirpSchema = addMocksToSchema({ schema: chirpSchema });\nauthorSchema = addMocksToSchema({ schema: authorSchema });\n\n// setup subschema configurations\nexport const chirpSubschema = { schema: chirpSchema };\nexport const authorSubschema = { schema: authorSchema };\n\n// build the combined schema\nexport const gatewaySchema = stitchSchemas({\n  subschemas: [\n    chirpSubschema,\n    authorSubschema,\n  ]\n});\n")),Object(o.b)("p",null,"This process builds two (mocked) GraphQL schemas, places them each into subschema configuration wrappers, and then passes the subschema configs to ",Object(o.b)("inlineCode",{parentName:"p"},"stitchSchems")," to produce one combined schema that looks like this:"),Object(o.b)("pre",null,Object(o.b)("code",Object(a.a)({parentName:"pre"},{className:"language-graphql"}),"type Query {\n  chirpById(id: ID!): Chirp\n  chirpsByAuthorId(authorId: ID!): [Chirp]!\n  userById(id: ID!): User\n}\n")),Object(o.b)("p",null,"We now have a single gateway schema that supports asking for user and/or chirp data in the same query!"),Object(o.b)("h2",{id:"subschema-configs"},"Subschema Configs"),Object(o.b)("p",null,'In the example above, the extra "subschema" wrapper objects may look verbose at first glance, but they are actually basic implementations of the ',Object(o.b)("inlineCode",{parentName:"p"},"SubschemaConfig")," interface that we can add several additional settings onto (discussed throughout this guide):"),Object(o.b)("pre",null,Object(o.b)("code",Object(a.a)({parentName:"pre"},{className:"language-js"}),"export interface SubschemaConfig {\n  schema: GraphQLSchema;\n  rootValue?: Record<string, any>;\n  executor?: Executor;\n  subscriber?: Subscriber;\n  createProxyingResolver?: CreateProxyingResolverFn;\n  transforms?: Array<Transform>;\n  merge?: Record<string, MergedTypeConfig>;\n}\n")),Object(o.b)("p",null,"Subschema config should ",Object(o.b)("em",{parentName:"p"},"directly")," provide as many settings as possible to avoid unnecessary layers of delegation. For example, while ",Object(o.b)("inlineCode",{parentName:"p"},"wrapSchema")," ",Object(o.b)("em",{parentName:"p"},"could")," be used to pre-wrap a schema with transforms and a remote executor, that would be far less efficient than providing the ",Object(o.b)("inlineCode",{parentName:"p"},"schema"),", ",Object(o.b)("inlineCode",{parentName:"p"},"transforms"),", and ",Object(o.b)("inlineCode",{parentName:"p"},"executor")," options directly to subschema config."),Object(o.b)("p",null,"Also note that the original subschema config objects will need to be referenced again in other stitching contexts. With that in mind, you'll probably want to export your subschema configs from their module(s) so they may be referenced throughout your app."),Object(o.b)("h2",{id:"stitching-remote-schemas"},"Stitching remote schemas"),Object(o.b)("p",null,"To include a remote schema, we'll need to provide subschema config settings for","\u2014","at minimum","\u2014","a ",Object(o.b)("em",{parentName:"p"},"non-executable")," schema and an executor that connects to the remote API:"),Object(o.b)("pre",null,Object(o.b)("code",Object(a.a)({parentName:"pre"},{className:"language-js"}),"import { buildSchema } from 'graphql';\nimport { linkToExecutor } from '@graphql-tools/links';\n\nexport const chirpSubschema = {\n  schema: buildSchema(chirpTypeDefs),\n  executor: linkToExecutor(chirpServiceLink),\n};\n")),Object(o.b)("p",null,"The remote schema's definition string may be obtained via introspection (see ",Object(o.b)("inlineCode",{parentName:"p"},"introspectSchema"),") or through your own internal protocol."),Object(o.b)("p",null,"An executor is a generic method of connecting to a schema. You may write your own, or use the ",Object(o.b)("inlineCode",{parentName:"p"},"linkToExecutor")," helper to wrap a link package such as ",Object(o.b)("a",Object(a.a)({parentName:"p"},{href:"https://www.apollographql.com/docs/link/links/http/"}),"apollo-link-http"),". Subschema config accepts an ",Object(o.b)("inlineCode",{parentName:"p"},"executor")," option for query and mutation operations, and a ",Object(o.b)("inlineCode",{parentName:"p"},"subscriber")," function for subscription operations. See the ",Object(o.b)("a",Object(a.a)({parentName:"p"},{href:"/docs/remote-schemas/"}),"remote schema")," docs for more information."),Object(o.b)("p",null,Object(o.b)("em",{parentName:"p"},Object(o.b)("strong",{parentName:"em"},"For pre-version 5:")," the old method of using ",Object(o.b)("a",Object(a.a)({parentName:"em"},{href:"/docs/remote-schemas/"}),"makeRemoteExecutableSchema")," to create a local proxy of a remote schema still works. However, it adds an additional layer of delegation that can be avoided by sending settings directly to ",Object(o.b)("inlineCode",{parentName:"em"},"stitchSchemas")," via SubschemaConfig.")),Object(o.b)("h2",{id:"duplicate-type-definitions"},"Duplicate type definitions"),Object(o.b)("p",null,"By default, schema stitching will override type definitions that are duplicated across subschemas","\u2014","always favoring the final definition of fields, arguments, and docstrings for a type found in the ",Object(o.b)("inlineCode",{parentName:"p"},"subschemas")," array. This works fine when subschemas implement identical versions of an object type. For divergent type definitions, you may now enable ",Object(o.b)("a",Object(a.a)({parentName:"p"},{href:"/docs/stitch-type-merging"}),"type merging")," (as of GraphQL Tools 5) to smartly merge partial type definitions from across subschemas."),Object(o.b)("h2",{id:"adding-transforms"},"Adding transforms"),Object(o.b)("p",null,"Another strategy to avoid conflicts while combining schemas is to modify one or more of the schemas using ",Object(o.b)("a",Object(a.a)({parentName:"p"},{href:"/docs/schema-wrapping"}),"transforms"),". Transforming allows a schema to be groomed in such ways as adding namespaces, renaming types, or removing fields (to name a few) prior to stitching it into the combined gateway schema. As of GraphQL Tools version 5, we can now add these transforms directly to subschema config (rather than delegating to a transformed schema wrapper):"),Object(o.b)("pre",null,Object(o.b)("code",Object(a.a)({parentName:"pre"},{className:"language-js"}),"import { FilterRootFields, RenameTypes } from '@graphql-tools/wrap';\n\nconst chirpSubschema = {\n  schema: chirpSchema,\n  transforms: [\n    new FilterRootFields((operation, rootField) => rootField !== 'chirpsByAuthorId'),\n    new RenameTypes((name) => `Chirp_${name}`),\n  ],\n};\n")),Object(o.b)("p",null,"In the example above, we transform the ",Object(o.b)("inlineCode",{parentName:"p"},"chirpSchema")," by removing the ",Object(o.b)("inlineCode",{parentName:"p"},"chirpsByAuthorId")," root field and adding a ",Object(o.b)("inlineCode",{parentName:"p"},"Chirp_")," prefix to all types. These modifications will only be present in the combined gateway schema."))}h.isMDXComponent=!0},198:function(e,t,n){"use strict";n.d(t,"a",(function(){return p})),n.d(t,"b",(function(){return d}));var a=n(0),r=n.n(a);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function s(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function c(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},o=Object.keys(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var m=r.a.createContext({}),h=function(e){var t=r.a.useContext(m),n=t;return e&&(n="function"==typeof e?e(t):s({},t,{},e)),n},p=function(e){var t=h(e.components);return r.a.createElement(m.Provider,{value:t},e.children)},l={inlineCode:"code",wrapper:function(e){var t=e.children;return r.a.createElement(r.a.Fragment,{},t)}},b=Object(a.forwardRef)((function(e,t){var n=e.components,a=e.mdxType,o=e.originalType,i=e.parentName,m=c(e,["components","mdxType","originalType","parentName"]),p=h(n),b=a,d=p["".concat(i,".").concat(b)]||p[b]||l[b]||o;return n?r.a.createElement(d,s({ref:t},m,{components:n})):r.a.createElement(d,s({ref:t},m))}));function d(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=n.length,i=new Array(o);i[0]=b;var s={};for(var c in t)hasOwnProperty.call(t,c)&&(s[c]=t[c]);s.originalType=e,s.mdxType="string"==typeof e?e:a,i[1]=s;for(var m=2;m<o;m++)i[m]=n[m];return r.a.createElement.apply(null,i)}return r.a.createElement.apply(null,n)}b.displayName="MDXCreateElement"}}]);