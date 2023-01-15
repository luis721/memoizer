# Memoizer

## Description

Memoizer allows you to memoize values. You can provide a fallback function that will be in charge of retrieving the missing keys when you try to access them.

## Usage

### Usage with a fallback

When you initialize the memoizer with a fallback it use it to retrieve the missing key value and memoize it.

```
    // initialize the memoizer

    // the fallback retrieves the value from the db
    // or whatever async (or sync) source you're using.
    async function fallback(key){
        return await mydb.findById(key);
    }

    const { set, get } = Memoizer(fallback);

    // set values
    set(1, {name:'John Cage', age: 24})
    set(2, {name:'John Smith', age: 25})

    // get values
    const info = await get(1);

    // this will retrieve the value from the fallback
    const anotherValue = await get(3);

    // next time it's accessed
    // it'll be already memoized
    const anotherValue2 = await get(3);

```

### Usage without a fallback

When you initialize the memoizer without a fallback it will throw an error when you try to access a key not already set.

```
    // initialize the memoizer
    const { set, get } = Memoizer();

    // set values
    set(1, {name:'John Cage', age: 24});
    set(2, {name:'John Smith', age: 25});

    // get values
    const info = await get(1);

    // this will throw an error
    const anotherValue = await get(3);
```

### Another options

#### Overwrite

```
    // initialize the memoizer
    const { set, get } = Memoizer();

    // set values
    set(1, {name:'John Cagex', age: 24});

    // this won't change the current value
    set(1, {name:'John Cage', age: 25});

    // this will change the current value
    set(1, {name:'John Cage', age: 25}, true);

```
