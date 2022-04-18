if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const path = require('path');
const ejsMate = require('ejs-mate');
const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const langSupport = [
    {
        n: "C",
        v: "C"
    },
    {
        n: "C++",
        v: "CPP"
    },
    {
        n: "C++11",
        v: "CPP11"
    },
    {
        n: "C++14",
        v: "CPP14"
    },
    {
        n: "Clojure",
        v: "CLOJURE"
    },
    {
        n: "C#",
        v: "CSHARP"
    },
    {
        n: "Go",
        v: "GO"
    },
    {
        n: "Haskell",
        v: "HASKELL"
    },
    {
        n: "Java",
        v: "JAVA"
    },
    {
        n: "Java 8",
        v: "JAVA8"
    },
    {
        n: "JavaScript(Rhino)",
        v: "JAVASCRIPT"
    },
    {
        n: "JavaScript(Nodejs)",
        v: "JAVASCRIPT_NODE"
    },
    {
        n: "Kotlin",
        v: "KOTLIN"
    },
    {
        n: "Objective C",
        v: "OBJECTIVEC"
    },
    {
        n: "Pascal",
        v: "PASCAL"
    },
    {
        n: "Perl",
        v: "PERL"
    },
    {
        n: "PHP",
        v: "PHP"
    },
    {
        n: "Python 2",
        v: "PYTHON"
    },
    {
        n: "Python 3",
        v: "PYTHON3"
    },
    {
        n: "R",
        v: "R"
    },
    {
        n: "Ruby",
        v: "RUBY"
    },
    {
        n: "Rust",
        v: "RUST"
    },
    {
        n: "Scala",
        v: "SCALA"
    },
    {
        n: "Swift",
        v: "SWIFT"
    },
    {
        n: "Swift 4.1",
        v: "SWIFT_4_1"
    },
]

const Client_Secret_Key = process.env.Client_Secret_Key || 'null';

app.get('/', (req, res) => {
    res.render('index', { langSupport, Client_Secret_Key });
})

app.listen(3000, () => {
    console.log("Listening on PORT 3000");
})