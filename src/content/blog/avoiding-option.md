In Scala (and [other languages](https://en.wikipedia.org/wiki/Option_type), the `Option` type is great. It allows you to move all of the tedius runtime `null` checks and tests to something that the compiler can validate before you've even run your code.

However, just because it exists does not mean that you should be using it everywhere. If you can make guarantees about the data flowing through your application, then you can avoid using it altogether.

For example, let's say you're building a simple REST API that feeds data into a SQL database. If you can have `NOT NULL` constraints on the data fields in the database that serve no purpose being `null`, then you can avoid data coming back from the DB with nullable fields. Likewise, on the REST API, if you also can reject requests that would create or update data with `null` values that correspond to the `NOT NULL` constraints in the database, you've now shielded yourself from ever needing to use `Option` within the walls of your application.

There are some good benefits to this:

1. This forces you to think about your data model. You will have a much deeper understanding of your data and the state your data can be in with respect to the business value that all of it individually adds.
2. This will reduce the amount of code in your application by a noticeable amount anywhere you need to actually interact or respond to any of this data.
3. This reduces the cognitive overhead of needing to work with this data. Your data model is now more implicitly documented, so anyone who jumps into your application can easily understand that these fields will never be `null`.

## (not so) Optional Lists

One common use case here would be when you are dealing with a list of items that can be guaranteed to be non-nullable.

Consider the following snippet where the `Option` type is extraneous. The logic still has to be coded in such a way to deal with the type:

```scala
var maybeSeq: Option[Seq[String]] // ignore `var` vs. `val`; just trying to illustrate a point here

// in order to do anything with maybeSeq,
// you have to deal with the option in addition to any list checks

// you have three high-level states that this variable could be in
maybeSeq = Some(Nil) // empty list
maybeSeq = Some(Seq("value")) // non-empty list
maybeSeq = None // essentially, null

// conditionally handling
// (this is the most concise example I could come up with to handle these types
// as if the `Option` type would never be `None`)
maybeSeq match {
 case Some(x) if (x.nonEmpty) => // do something if list is non-empty
 case _ => // do something if list is None or empty
}
```

Now consider the following snippet where `Option` is absent completely:

```scala
var seq: Seq[String]
// you only have two high-level states that this variable could be in
seq = Nil // empty list
seq = Seq("value") // non-empty list

// conditionally handling
if (seq.nonEmpty) {
  // do something if list is non-empty
} else {
  // do something if list is empty
}
```

The above snippets are basically logically equivalent ways of dealing with this scenario. Though, notice how the second example is more straightforward and readable compared to the first example.

## Conclusion

Hopefully, this post has shed some light over how you should be thinking about your data types. It may take some extra time up front, but you will benefit from it greatly in a short amount of time!
