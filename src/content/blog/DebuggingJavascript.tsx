import type {ReactNode} from 'react';
import {BlogButton} from '@/components/blog/BlogButton';
import {CodeHighlight} from '@/components/blog/CodeHighlight';
import profilerFf from '@/assets/blog/profiler-ff.png';
import profilerChrome from '@/assets/blog/profiler-chrome.png';

function Footnote({n, children}: {n: number; children: ReactNode}) {
  return (
    <p className="blog-footnote">
      <sup>{n}</sup> {children}
    </p>
  );
}

// ---- The real, interactive JavaScript demos referenced in the post ----
// These run actual JS when the buttons are clicked, just like the original.

const blog = {
  manualBreakpoints: function () {
    var double = 4.444;
    var obj = {
      prop1: 'value1',
      prop2: 'value2',
      num: 1,
      func: function () {
        return false;
      },
      arr: [1, 2, 3, 4, 5],
    };
    var value = true;
    var string = 'some text';
    var arr = [obj.num, obj, string];

    if (obj.num === 2) {
      // breakpoint_here
      /**
       * When stopped, have a look at the right side panel of your developer tools.
       * Like I said, you can view (and edit!) any variables in memory, look at the
       * call stack, add watch statements, etc.
       *
       * Try editting the 'obj.num' variable so that the following conditional alert will display.
       *
       * When you've done this, please resume JavaScript execution by clicking on the Play button
       * and continue reading
       */
      alert("You're winner!");
    }

    return true;
  },

  testConsoleObj: function () {
    if (console) {
      debugger;
      /**
       *  Step over each of the following lines to try them out.
       *
       *  Remember to enable your console quick view! (Again, 'Esc' in Chrome and
       *  Ctrl+Shift+L/Cmd+Shift+L in Firebug)
       */
      console.log('console.log()'); // logging; a normal message
      console.info('console.info()'); // like console.debug, but adds message styling in Firebug
      console.warn('console.warn()'); // like console.info, but styles as a warning
      console.error('console.error()'); // like console.warn, but styles as an error
      console.group('console.group()'); // like console.log, but will nest subsequent messages
      console.log('testing group...');
      console.groupEnd(); // ends console.group nesting
      console.groupCollapsed('console.groupCollapsed()'); // like console.group, but group will be initially collapsed
      console.log('testing groupCollapsed...');
      console.groupEnd(); // ends console.groupCollapsed nesting
      console.assert(true, 'assertion failed'); // like console.error, but is conditional
      console.assert(!true, 'assertion failed'); // will only error out if argument one evaluates to false
      console.dir(this); // outputs properties of a passed object
      console.dirxml(this); // like console.dir, but outputs in different format
      console.time('timer1'); // starts a stopwatch
      console.timeEnd('timer1'); // stops a startwatch... wat
      console.timeStamp('test'); // outputs a timestamp (no workie in Chrome)
      //console.count();          // outputs the number of times this line gets executed; test below
      var consoleCount = function () {
        console.count('msg');
      };
      for (var i = 0; i < 3; i++) {
        consoleCount();
      }

      //console.profile();        // used for profiling, which will be talked about next!
      //console.profileEnd();       // used for profiling, which will be talked about next!
      console.clear(); // clears the console

      // resume execution here; Firebug doesn't like simply stepping over console.trace()
      console.trace(); // prints call stack from this function
    }
  },

  testProfiler: function () {
    var something = function () {
      var quotient = 12849012490182490124819024 / 1289418294;
    };
    var something2 = function () {
      return false;
    };
    var something3 = function (arr: number[]) {
      return arr.reverse();
    };
    if (console && console.profile) {
      console.profile('Profiler Test'); // start profiler
    }
    for (var i = 0; i < 500000; i++) {
      something();
      if (i % 3 == 0) {
        something2();
      } else {
        something3([1, 2, 3, 4, 5]);
      }
    }
    if (console && console.profileEnd) {
      console.profileEnd(); // stop profiler
    }
  },

  consoleDebugging: function () {
    var names = [
      'Hubert Cumberdale',
      'Marjory Stewart-Baxter',
      'Jeremy Fisher',
      'Barbara Logan-Price',
      'Milford Cubicle',
    ];
    var reallyComplexObject = {
      names: undefined,
      age: 20,
      property: 'hay guyz',
      value: false,
    };
    var palindrome = 'A man, a plan, a canal: Panama.';
    var add = function (num1: number, num2: number) {
      if (num1 && !isNaN(num1) && num2 && !isNaN(num2)) {
        return num1 + num2;
      } else {
        return 'Invalid input';
      }
    };

    // see comment below
    debugger;
    /**
     * Now that we're stopped, try and play around with the console. Hit 'Esc' in Chrome or
     * Ctrl+Shift+L/Cmd+Shift+L in Firebug to toggle the console. Input the following statements:
     *    add(2, 2)    // call a local function
     *    names[2]     // get a specific value of an array
     *    this       // outputs the object that holds the current scope (declared earlier as "blog")
     *    palindrome.split("").reverse().join("");  // reverses a string using array manipulation (don't worry, I stole this from stackoverflow)
     *
     * Now, let's try a series of related statements. reallyComplexObject.names is undefined,
     * but we can change that:
     *    reallyComplexObject.names         // outputs the value
     *    reallyComplexObject.names = names     // re-assign the value and output new value
     *    reallyComplexObject.names === names   // test for equality
     *
     * Finally, change what we're going to be returning in this function (you devious hacker, you!):          *
     *    this.value = true    // re-assign the value
     *
     * Upon resuming, this will trigger console message that shouldn't normally appear. Also,
     * because you're modifying a value in "blog"'s scope, this value will remain changed
     * every time you reference "blog".
     *
     * Go ahead, resume execution and continue reading.
     */
    return this.value;
  },

  testDebugger: function () {
    // see? just like a normal breakpoint.
    debugger;
    // resume execution and read on to find why this is useful.
  },

  value: false,
};

export function DebuggingJavascript() {
  return (
    <div className="blog-prose">
      <p>
        The tricky part about writing a blog on a topic like this is that you, the reader, are most
        likely already pissed off because your <abbr title="JavaScript">JS</abbr> isn&apos;t
        working. Therefore, my content here is probably already being judged. Regardless, this
        hopefully won&apos;t be a complete waste of your time (I&apos;m aiming for only 15-20%), but
        please note that{' '}
        <strong>this tutorial is aimed at web development beginners and/or JS novices</strong>. But
        hey, I&apos;m still a fun guy; maybe you&apos;ll enjoy reading regardless. I&apos;m also
        making the assumption that you&apos;re viewing this page in{' '}
        <a href="https://www.google.com/chrome">Chrome</a> or{' '}
        <a href="http://getfirefox.com/">Firefox</a> with{' '}
        <a href="https://getfirebug.com/">Firebug</a> installed.
      </p>
      <p>When ready, please read on.</p>

      <h3>Breakpoints</h3>
      <p>
        With modern-day tools, UI developers have the luxury of debugging JS while it&apos;s being
        executed by specifying breakpoints to look at what&apos;s in memory. This is conceptually
        the same as, say, defining a breakpoint in your Java program. Indeed, you&apos;ll find a lot
        of similarities as well. You do such things as inspect the variables in your current scope
        (and its closures!) and view the function call stack. You can also manually run console
        commands, but this will be explained later.
      </p>
      <p>
        In both browsers, you can set a breakpoint by left-clicking on a line number of your script.
        To set a conditional breakpoint, right-click on the desired line instead.
      </p>
      <p>
        Let&apos;s set some manual breakpoints. In the embedded JS of this page<sup>1</sup>,
        I&apos;ve put a commented &quot;bookmark&quot; of where you should manually set a
        breakpoint. In the &quot;Sources&quot; (Chrome) or &quot;Scripts&quot; (Firebug) tab, do a
        Ctrl+F/⌘+F for <code>breakpoint_here</code> and set your breakpoint on that line. You cannot
        actually browse the rest of this page while your JS has halted, so instructions for what to
        do while you&apos;re debugging are written in JS comments. To call the function where this
        breakpoint should be, click the button below:
      </p>
      <BlogButton id="btn-manual-breakpoints" onClick={() => blog.manualBreakpoints()}>
        blog.manualBreakpoints();
      </BlogButton>
      <Footnote n={1}>I know, embedded JS. Sorry, I&apos;m not sorry.</Footnote>

      <h3>The Debugger Keyword</h3>
      <p>
        K, now forget everything I just talked about regarding manually setting breakpoints for a
        second. Enter, the debugger keyword. Shockingly, a statement with it looks like this:
      </p>
      <CodeHighlight language="javascript" code="debugger;" />
      <p>
        It will automatically act as a breakpoint in your JS code when processed by browser. Go
        ahead,
      </p>
      <BlogButton id="btn-debugger" onClick={() => blog.testDebugger()}>
        try it out
      </BlogButton>
      <p>
        This keyword is usually better<sup>2</sup> than the alternative for a couple reasons:
      </p>
      <ol>
        <li>
          You no longer need to sift through all of the JS files loaded to the page to find the
          exact line you&apos;re trying to debug.
        </li>
        <li>
          When actively debugging and changing your scripts around, you can sometimes lose
          breakpoints if set on a line that would no longer be valid to break on.{' '}
          <code>debugger</code> will always be there in text, so you&apos;ll never run into this
          problem.
          <ul>
            <li>
              For instance, you set a breakpoint in your browser on line 294. You&apos;ve since
              added some code, and now, after a refresh, line 294 is just whitespace. Your browser
              will then either happily skip this breakpoint or stop somewhere else, and you&apos;ll
              proceed to take the axe you brought to work to your poor, poor computer.
            </li>
          </ul>
        </li>
      </ol>
      <Footnote n={2}>
        I say &quot;usually better&quot; because sometimes I use <code>debugger</code> in
        conjunction with manual breakpoints. For example, I&apos;ll use it just to get me to the
        right place to debug; then, if there&apos;s a lot going on, I&apos;ll litter the whole thing
        with manual breakpoints. Also, you can&apos;t directly set breakpoint conditions with{' '}
        <code>debugger</code> like you can with manual breakpoints. You would need to surround{' '}
        <code>debugger</code> with an <code>if</code> statement to achieve the same effect. Your
        mileage may vary.
      </Footnote>

      <h3>Console Debugging</h3>
      <p>
        Both Firebug and Chrome Developer Tools have a very, very powerful console used to execute
        JS statements. Because JS requires no compilation, you can feed it literally any block of JS
        code, and it will give you the relevant output in any particular scope. Demo the console by
        clicking on this button and following the directions contained in the JS comments:
      </p>
      <BlogButton
        id="btn-console-debugging"
        onClick={() => {
          if (blog.consoleDebugging() && console) {
            console.error('blog.value was truthy somehow. Abandon internets.');
          }
        }}
      >
        Console your lonely console
      </BlogButton>

      <h3>The Global Console Object</h3>
      <p>
        If you modified <code>this.value</code> to be true in the previous tutorial LIKE I HAD SO
        NICELY ASKED, you would have noticed the error message in your console. There is a global{' '}
        <code>console</code> object that is exposed to your browser window via Chrome and Firebug.
        The previous error message was created by calling the <code>console.error()</code> function
        <sup>3</sup>. While mostly just a regurgitation of{' '}
        <a href="https://getfirebug.com/wiki/index.php/Console_API">this Firebug documentation</a>,
        the various <code>console</code> function calls can be seen <em>in action</em> here:
      </p>
      <BlogButton id="btn-test-console-obj" onClick={() => blog.testConsoleObj()}>
        jaoidsajsoifd
      </BlogButton>
      <p>
        Gone are the days of using <code>alert()</code> just to debug some variable.
      </p>
      <p>
        <strong>Important Note</strong>: just like everything else, IE8 support is non-existent for
        the console object. If you are to leave <code>console</code> function calls in your code for
        a production-ready application, be sure you add a conditional statement checking for the
        existance of <code>console</code> like I did in this example, or you will see page errors!
      </p>
      <Footnote n={3}>
        If you looked for this statement and couldn&apos;t find it, a) props to you for actually
        caring b) it was quasi-hidden in the <code>onclick</code> attribute of the &quot;Console
        your lonely console&quot; input button.
      </Footnote>

      <h3>The JavaScript Profiler</h3>
      <p>
        This tool is used for analyzing the performance of your JS. When using large JS frameworks
        where a lot of things are happening client-side, this tool is great for narrowing down what
        could be slowing down your app. However, in smaller apps where there isn&apos;t a whole lot
        of JS, you probably won&apos;t find yourself mucking around with this too much, as the
        potential performance gain will most likely be minimal. Nevertheless, this is how it works:
      </p>
      <p>Manually:</p>
      <ul>
        <li>
          <p>In Firebug,</p>
          <ul>
            <li>
              Navigate to the &quot;Console&quot; tab. Click &quot;Profile&quot; once to start the
              profiler and again to stop it.
              <br />
              <img src={profilerFf} alt="profiler-ff" loading="lazy" />
            </li>
          </ul>
        </li>
        <li>
          <p>In Chrome,</p>
          <ul>
            <li>
              Navigate to the dedicated &quot;Profiles&quot; tab. If it is not already toggled,
              select &quot;Collect JavaScript CPU Profile&quot;. Click &quot;Start&quot; to start
              the profiler and &quot;Stop&quot; to end the data gathering.
              <br />
              <img src={profilerChrome} alt="profiler-chrome" loading="lazy" />
              <br />
              <small>
                (Sidenote: Stable release of Chrome 25 literally came out yesterday while I was in
                the middle of writing this entry in Chrome 24 over the past few days. They changed
                the header bar, so I had to retake this screenshot just so my blog still seemed
                somewhat valid. I can&apos;t wait for next week when none of this will be relevant
                anymore)
              </small>
            </li>
          </ul>
        </li>
      </ul>
      <p>Automagically:</p>
      <ul>
        <li>
          Simply use the following code snippet to surround what you&apos;d like to profile:
          <CodeHighlight
            language="javascript"
            code={`console.profile("some label");
// lots of function calls here
console.endProfile();`}
          />
        </li>
      </ul>
      <p>
        During the time between start and stop, the profiler will keep track of all that was
        executed along with the total time taken for execution within each function. Then, when
        stopped, all of the data will be outputted to the screen. Try out an example run of the
        automatic profiler:
      </p>
      <BlogButton id="btn-test-profiler" onClick={() => blog.testProfiler()}>
        gogogo
      </BlogButton>
      <p>
        <small>
          The code wrapped by this profiler isn&apos;t really doing anything. It&apos;s mostly just
          a bunch of jumbled stuff that came to my head first for demonstration purposes. However,
          if you&apos;re curious about what&apos;s going on, the function that&apos;s being called
          is <code>testProfiler</code>.
        </small>
      </p>
      <p>
        To view the profile in Chrome, click the link that appears in the console (or click the
        &quot;Profiles&quot; tab and then &quot;Profiler Test&quot;). In Firebug, it will output in
        the console.
      </p>

      <h3>Conclusion</h3>
      <p>
        Because I&apos;m lazy, I&apos;m going to start concluding by explicitly saying that I&apos;m
        doing so<sup>4</sup>. At any rate, by now you should (hopefully) have a good grasp on how to
        use two very powerful tools for JS debugging. If you enjoyed reading this blog and{' '}
        <em>truly</em> think you learned something, you were completely and utterly fooled. Here are
        some references to further reading where you will actually learn stuff:
      </p>
      <ul>
        <li>
          The first time that I had &quot;worked&quot; with JS was mostly via jQuery. While jQuery
          is an incredibly awesome library, when I was asked to work on an application that used an
          extensive client-side MVC JavaScript framework, I found that my knowledge of JS
          fundamentals was lacking (e.g., closures). As such, I found{' '}
          <a href="https://youtu.be/YcylSiDoOio">this YouTube video</a> insanely helpful for making
          that transition. If you don&apos;t care about jQuery, you only need to watch until @30:00
          to get all of the core JS knowledge.
        </li>
        <li>
          If you didn&apos;t get why I poked at embedded JS being bad, consider{' '}
          <a href="http://robertnyman.com/2008/11/20/why-inline-css-and-javascript-code-is-such-a-bad-thing/">
            this blog post
          </a>
          . Though, for something as simple as this blog post, inlining makes for easier interaction
          (for the tutorials) and maintanence (because it makes this blog post just one convenient
          HTML file).
        </li>
        <li>
          In two of the JS debugging tutorials, I brushed up against a security issue with front-end
          validation that&apos;s easily preventable. Because you saw how easy it was to manipulate
          variables in memory, you can&apos;t solely rely on your JS to ensure you have clean data.
          It is simply a luxury for guiding your users through your site. Always provide back-end
          validation for every value submitted through every request that gets sent to your app. As
          always, <a href="https://www.owasp.org/">OWASP</a> provides to be a great resource in web
          security; read up on{' '}
          <a href="https://www.owasp.org/index.php/Data_Validation">
            their article on data validation
          </a>{' '}
          for more information on this particular subject.
        </li>
      </ul>
      <Footnote n={4}>Apologies to my high school English teachers.</Footnote>
    </div>
  );
}
