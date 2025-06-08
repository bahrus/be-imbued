# be-imbued (🧧)


*be-imbued* enables sprinkling DOM into targeted sections of a DOM tree.  

[![Playwright Tests](https://github.com/bahrus/be-imbued/actions/workflows/CI.yml/badge.svg?branch=baseline)](https://github.com/bahrus/be-imbued/actions/workflows/CI.yml)
[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/be-imbued)
<a href="https://nodei.co/npm/be-imbued/"><img src="https://nodei.co/npm/be-imbued.png"></a>

Like other [be-enhanced](https://github.com/bahrus/be-enhanced) based [custom enhancements](https://github.com/WICG/webcomponents/issues/1000), be-imbued can use attributes to enhance the functionality of the element it adorns.  

However, the core functionality be-imbued addresses seems [so fundamental and important](https://github.com/bahrus/mount-observer?tab=readme-ov-file#birtual-inclusions), that its functionality is already built into the underlying infrastructure supporting custom enhancements and binding from a distance (like [trans-rendering](https://github.com/bahrus/trans-render/wiki/V.--Mount%E2%80%90observing-transforms) supports).

Namely, without any help from this particular package, we can already do:

```html
<div class=stanza id=Opening>
    <div>I don't care if <span itemprop=day1>Monday</span>'s blue</div>
    <div><span itemprop=day2>Tuesday</slot>'s gray and <span itemprop=day3>Wednesday</span> too</div>
    <div><span itemprop=day4>Thursday</span> I don't care about you</div>
    <div id=Friday>
        <div>It's <span itemprop=day5></span> I'm in love</div>
    </div>
</div>

<div class=stanza id=art>
    <div><span itemprop=day1>Monday</span> you can fall apart</div>
    <div><span itemprop=day2>Tuesday</span> <span itemprop=day3>Wednesday</span> break my heart</div>
    <div>Oh, <span itemprop=day4>Thursday</span> doesn't even start</div>
    <template src=#Friday></template>
</div>

```

... which allows us to reuse the HTML snippet:

```html
<div id=Friday>
    <div>It's <span itemprop=day5></span> I'm in love</div>
</div>
```

via:

```html
<template src=#Friday></template>
```


This syntax allows IDE's like VS Code to be able to jump to the source without the need for extensions being installed.

The syntax could also be used to good effect during a build process (SSG) or while server-side rendering, or in a service worker, [w3c willing](https://github.com/whatwg/dom/issues/1222).  If used with server-side rendering, the resulting HTML could be significantly heavier (even after factoring in gzip), so it could often be a net loss to do so on the server, rather than on the client.  This package contains no such support currently for server-side rendering.  

## Example 1 - Simplest example with no value added from this package, no slots

Song lyrics can be "deconstructed" and repetitive sections (like the chorus) shared, without a single line of JavaScript (once the MountObserver API is loaded).

Please expand below to see the "code".

<details>
<summary>Applying DRY to punk lyrics</summary>

```html
<a rel=noopener href="https://www.youtube.com/watch?v=tWbrAWmhDwY" target="_blank">Something's gone wrong again</a>

<div class=stanza>
    <div>Tried to find my sock</div>
    <div>No good, it's lost</div>
    <div id=title>Something's gone wrong again</div>
    <div>Need a shave</div>
    <div>Cut myself, need a new blade</div>
    
</div>

<div class=stanza>
    <template src=#title></template> 
    <div id=agains>
        <span id=again>And again</span> <span id=again2>And again, and again, again and something's gone wrong again</span>
        <template src=#title></template>
    </div>
</div>

<div class=stanza>
    <span>Tried to fry an egg</span><br>
    <span>Broke the yolk, no joke</span><br>
    <template src=#title></template> 
    <div>Look at my watch, just to tell the time but the hand's come off mine</div>
    <template src=#title></template> 
    
</div>

<div class=stanza>
    <template src=#title></template> 
    <template src=#agains></template> 

</div>

<div class=stanza>
    <div id="bus">
        <div>Nothing ever happens to people like us</div>
        <div>'Cept we miss the bus, something goes wrong again</div>
        
    </div> 
</div>

<div class=stanza>
    <div>Need a smoke, use my last fifty P.</div>
    <div>But the machine is broke, something's gone wrong again</div>
</div>


<div class=stanza>
    <template src=#agains></template> 
    <template src=#agains></template> 
    
</div>

<div class=stanza>
    <template src=#bus></template> 
    <template src=#agains></template> 
</div>

<div class=stanza>
    <div>
        <span>I turned up early in time for our date</span><br>
        <span>But then you turn up late, something goes wrong again</span><br>
        <span>Need a drink, go to the pub</span><br>
        <span>But the bugger's shut, something goes wrong again</span>
    </div>
</div>

<div class=stanza>
    <div id=title2>Something goes wrong again</div>
    <div>
        <template src=#again></template>
        <div></div>
    </div>
    <div>And again, and again, again and something goes wrong again</div>
    <div>Ah, something goes wrong again</div>
    <template src=#title2></template>
    <template src=#title2></template> 
</div>


<style>
    .stanza{
        padding-top:20px;
        padding-bottom: 20px;
    }
</style>
```

</details>

## Value-add of be-imbued 

The built-in inclusiveness that the mount-observer api supports has a fundamental limitation that Shadow DOM slots don't have -- with these "birtual inclusions", all traces of  "slots" vanish so as not to conflict in any way with the ShadowDOM support that slots provide.

And more significantly, the mechanism for updating the slots and having them be projected into the ShadowDOM is completely non existent with this solution.  That is the primary value-add of this library -- to provide some ability to emulate that feature (if you squint your eyes enough).  Basically, we provide for a companion template element to be able to receive children dynamically, and when such children appear, these children get cloned and weaved into the source DOM fragment, based on matching attributes.

## be-imbued in a nutshell

```html
<div itemscope id=love>
    <div class=stanza id=Opening>
        <div>I don't care if <span itemprop=day1></span>'s blue</div>
        <div><span itemprop=day2></slot>'s gray and <span itemprop=day3></span> too</div>
        <div><span itemprop=day4></span> I don't care about you</div>
        <div id=Friday>
            <div>It's <span itemprop=day5></span> I'm in love</div>
        </div>
    </div>

    <div class=stanza id=art>
        <div><span itemprop=day1></span> you can fall apart</div>
        <div><span itemprop=day2></span> <span itemprop=day3></span> break my heart</div>
        <div>Oh, <span itemprop=day4></span> doesn't even start</div>
        <template src=#Friday></template>
    </div>
    ...
</div>

<template  be-imbued="in #love">
    <span itemprop=day1>Monday</span>
    <span itemprop=day2>Tuesday</span>
    <span itemprop=day3>Wednesday</span>
    <span itemprop=day4>Thursday</span>
    <span itemprop=day5>Friday</span>
    <span itemprop=day6>Saturday</span>
    <span itemprop=day7>Sunday</span>
</template>
```


What this does:

1.  Searches within the DOM element with id "love" for elements whose attributes match the attributes of the child elements of the template element.
2.  When a match is found, replaces/inserts the children of the target match with the children of the template child.

Finessing the merge

In some cases, we want to "ignore" certain attributes in our match, and "insert" said attribute(s) into matching elements, in addition to weaving in the children.  This is done as follows:

```html
<div itemscope id=love>
    ...
    <data value=false itemprop=todayIsFriday>It's Thursday</data>
</div>

...

<template be-imbued="in #love">
    <data value=true itemprop=todayIsFriday -i="value">It's Friday</data>
</template>

```

-i can be a space delimited list of attributes to ignore during the query match / insert during the merge.

Since "be-imbued" is a rather lengthy attribute to use repeatedly, a shorter name can be used in less formal environments, where conflicts between different libraries are easy to avoid.  This package contains a reference that can be used to meet this desire for brevity:  🧧.

```html
<div itemscope id=love>
    ...
    <data value=false itemprop=todayIsFriday>It's Thursday</data>
</div>

...

<template 🧧="in #love">
    <data value=true itemprop=todayIsFriday -i="value">It's Friday</data>
</template>

```

## Example 2 in detail

To see the full example described above in detail, please expand below

<details>
    <summary>Tränslåtyng pøst pünk lyriks tø Sweedisλ</summary>

```html
<a href="https://www.youtube.com/watch?v=ucX9hVCQT_U" target="_blank">Friday I'm in Love</a>
<button onclick="updateDaysOfWeek()">Wi not trei a holiday in Sweeden this yer</button>

<div itemscope id=love>
    <div class=stanza id=Opening>
        <div>I don't care if <span itemprop=day1></span>'s blue</div>
        <div><span itemprop=day2></span>'s gray and <span itemprop=day3>Wednesday</span> too</div>
        <div><span itemprop=day4></span> I don't care about you</div>
        <div id=Friday>
            <div>It's <span itemprop=day5></span> I'm in love</div>
        </div>
    </div>

    <div class=stanza id=art>
        <div><span itemprop=day1></span> you can fall apart</div>
        <div><span itemprop=day2></span> <span itemprop=day3></span> break my heart</div>
        <div>Oh, <span itemprop=day4></span> doesn't even start</div>
        <template src=#Friday></template>
    </div>

    <div class="stanza" id=weekend>
        <div><span itemprop=day6></span> wait</div>
        <div>And <span itemprop=day7></span> always comes too late</div>
        <div>But <span itemprop=day5></span> never hesitate</div>
    </div>

    <div class="stanza">
        <div>I don't care if <span itemprop=day1></span>'s black</div>
        <div><span itemprop=day2></span>, <span itemprop=day3></span> heart attack</div>
        <div><span itemprop=day4></span> never looking back</div>
        <template src=#Friday></template>
    </div>

    <div class="stanza">
        <div><span itemprop=day1></span> you can hold your head</div>
        <div><span itemprop=day2></span>, <span itemprop=day3></span> stay in bed</div>
        <div>Or <span itemprop=day4></span> watch the walls instead</div>
        <template src=#Friday></template> 
    </div>

    <template src=#weekend></template>

    <div class="stanza">
        <div>Dressed up to the eyes</div>
        <div>It's a wonderful surprise</div>
        <div>To see your shoes and your spirits rise</div>
        <div>Throwing out your frown</div>
        <div>And just smiling at the sound</div>
        <div>And as sleek as a shriek</div>
        <div>Spinning round and round</div>
        <div>Always take a big bite</div>
        <div>It's such a gorgeous sight</div>
        <div>To see you in the middle of the night</div>
        <div>You can never get enough</div>
        <div>Enough of this stuff</div>
        <template src=#Friday></template>
    </div>

    <template src=#Opening></template>

    <template src=#art></template>
    
</div>

<style>
    .stanza{
        padding-top: 20px;
    }
</style>


<template id=daysOfWeek 
    be-imbued="in love"
>
    <span itemprop=day1>Monday</span>
    <span itemprop=day2>Tuesday</span>
    <span itemprop=day3>Wednesday</span>
    <span itemprop=day4>Thursday</span>
    <span itemprop=day5>Friday</span>
    <span itemprop=day6>Saturday</span>
    <span itemprop=day7>Sunday</span>
</template>

<script>
    function updateDaysOfWeek(){
        const html = String.raw;
        daysOfWeek.innerHTML = html `
            <span itemprop=day1>måndag</span>
            <span itemprop=day2>tisdag</span>
            <span itemprop=day3>onsdag</span>
            <span itemprop=day4>torsdag</span>
            <span itemprop=day5>fredag</span>
            <span itemprop=day6>lördag</span>
            <span itemprop=day7>söndag</span>
        `;
    }
</script>
```



</details>

If you need to pull the value from an element buried deep within the element, specify the path starting with a dot.

For example:

```html
<div slot=myInput init-val-from=.querySelector|input.value>
    <label>
        My Input:
        <input value=initialVal>
    </label>
</div>
```

The vertical pipe represents an open parenthesis that automatically closes at the end of the expression, or before the next period (".").

The init-val-from attribute is actually optional, and we use as much inference as possible to derive the initial value from the element -- if the element is a microdata element (as is the case here) it applies the same rules -- it assumes the value from the textContent.  If the element is an input element, it gets the value based on the type (checkbox, number, etc).

So this works just the same:

```html
<template id=song 
    be-imbued='{
        "of": "#love",
        "slotMap": {"span": "|"},
        "xform": {
            "| day1": 0,
            "| day2": 0,
            "| day3": 0,
            "| day4": 0,
            "| day5": 0,
            "| day6": 0,
            "| day7": 0
        },
        "initModel": {}
    }'
>
    <span slot=day1>Monday</span>
    <span slot=day2>Tuesday</span>
    <span slot=day3>Wednesday</span>
    <span slot=day4>Thursday</span>
    <span slot=day5>Friday</span>
    <span slot=day6>Saturday</span>
    <span slot=day7>Sunday</span>
</template>
```


## Example 3 - Adventures with the Shadow DOM

In the example below, this package again provides nothing beyond what is supported in the underlying library on which *be-imbued* (and other [be-enhanced](https://github.com/bahrus/be-enhanced) [enhancements](https://github.com/WICG/webcomponents/issues/1000)) rests -- the [MountObserver](https://github.com/WICG/webcomponents/issues/896).  Here we use slots / Shadow DOM in all its glory, using the platform's ability to update slots as needed, combined with the MountObserver's support for template importing (with ShadowDOM open/closed mode).

<details>
<summary>Sample Markup</summary>

```html
<style>
    div {
        background-color: cornsilk;
    }
</style>
    
<h3><a href="https://www.youtube.com/watch?v=eAfyFTzZDMM" target="_blank">Beautiful</a></h3>
<h4>Christina Aguilera</h4>

<p>Don't look at me</p>
<p>
    <div>Everyday is so wonderful</div>
    <div>Then suddenly</div>
    <div>It's hard to breathe</div>
    <div>Now and then I get insecure</div>
    <div>From all the pain</div>
    <div>I'm so ashamed</div>
</p>
<template id=beautiful>
    <div>
        <slot name=subjectIs></slot> beautiful
    </div>
</template>
<template id=down>
    <div>So don't you bring me down today</div>
</template>
<template id=chorus>
    <div>
        <template src=#beautiful shadowRootModeOnLoad=open></template>
        <span slot=subjectIs>
            <slot name=subjectIs1></slot>
        </span>
    </div>

    
    <div>No matter what they say</div>
    <div prop-pronoun>Words
        <slot name=verb1></slot> bring
        <slot name=pronoun1></slot> down</div>
    <div>Oh no</div>
    <div>
        <template src=#beautiful shadowRootModeOnLoad=open></template>
        <span slot=subjectIs>
            <slot name=subjectIs2></slot>
        </span>
    </div>

    <div>In every single way</div>
    <div>Yes words
        <slot name=verb2></slot> bring
        <slot name=pronoun2></slot> down
    </div>
    <div>Oh no</div>
    
    <template src=#down></template>
    </template>
    
    <div class=chorus>
    <template src=#chorus shadowRootModeOnLoad=open></template>
    <span slot=verb1>can't</span>
    <span slot=verb2>can't</span>
    <span slot=pronoun1>me</span>
    <span slot=pronoun2>me</span>
    <span slot=subjectIs1>I am</span>
    <span slot=subjectIs2>I am</span>
    </div>

    <p>
    <div>To all your friends you're delirious</div>
    <div>So consumed</div>
    <div>In all your doom, ooh</div>
    <div>Trying hard to fill the emptiness</div>
    <div>The pieces gone</div>
    <div>Left the puzzle undone</div>
    <div>Ain't that the way it is</div>
</p>

<p>
    <div class=chorus>
        <template src=#chorus shadowRootModeOnLoad=open></template>
        <span slot=verb1>can't</span>
        <span slot=verb2>can't</span>
        <span slot=pronoun1>you</span>
        <span slot=pronoun2>you</span>
        <span slot=subjectIs1>You are</span>
        <span slot=subjectIs2>You are</span>
    </div>
</p>
<br>
<template id=no-matter>
    No matter what we <slot name=verb1></slot> (no matter what we <slot name=verb2></slot>)
</template>
<div>
    <template src=#no-matter shadowRootModeOnLoad=open></template>
    <span slot=verb1>do</span>
    <span slot=verb2>do</span>
</div>
<div>
    <template src=#no-matter shadowRootModeOnLoad=open></template>
    <span slot=verb1>say</span>
    <span slot=verb2>say</span>
</div>

<div>We're the song inside the tune (yeah, oh yeah)</div>
<div>Full of beautiful mistakes</div>
<p>
    <div>And everywhere we go (and everywhere we go)</div>
    <div>The sun will always shine (the sun will always, always, shine)</div>
    <div>And tomorrow we might awake</div>
    <div>On the other side</div>
</p>

<p>
    <div class=chorus>
        <template src=#chorus shadowRootModeOnLoad=open></template>
        <span slot=verb1>won't</span>
        <span slot=verb2>can't</span>
        <span slot=pronoun1>us</span>
        <span slot=pronoun2>us</span>
        <span slot=subjectIs1>We are</span>
        <span slot=subjectIs2>We are</span>
    </div>
</p>

<p>
    <div>Oh, oh</div>
    <div>Don't you bring me down today</div>
    <div>Don't you bring me down, ooh</div>
    <div>Today</div>
</p>
```
</details>



## Example 4 - Applying DRY to the song of the material universe [TODO]


The [Periodic Table Codepen](https://codepen.io/mikegolus/pen/OwrPgB) has lots of repetitive, periodic DOM in it.  Performance can actually be improved over server-rendering all ths HTML by utilizing templates for the purpose of reducing repeating HTML (yes, it even improves over HTML with gzip in place).

In order to support this, some features have been added to *be-imbued* -- specifying arrays of includes, and prepending when needed.

The markup can be found [here](https://github.com/bahrus/be-imbued/blob/baseline/demo/periodic_table.html).


[TODO] beatify

[WIP] share templates

## Viewing Demos Locally

1.  Install git.
2.  Fork/clone this repo.
3.  Install node.
4.  Open command window to folder where you cloned this repo.
5.  > npm install
6.  > npm run serve
7.  Open http://localhost:8000/demo/dev in a modern browser.













