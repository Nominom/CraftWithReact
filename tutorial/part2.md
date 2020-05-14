This is part 2 of my tutorial on building a blog site with React front-end and Craft CMS. If you missed the first one, you can find it [here](https://dev.to/nominom/building-a-personal-blog-with-craft-cms-react-and-element-api-part-1-setting-up-2235).

All the code for this tutorial is available on [github](https://github.com/Nominom/CraftWithReact).

In this part, we are going to set up a blog in Craft CMS, then expose the content with Element API.

### Step 5 - Enabling extensions

In the last part, we told composer that we need Redactor and Element API, but in Craft, they are not yet enabled.

To enable them, navigate to your Craft admin panel, and then to *Settings -> Plugins*. You should see Element API and Redactor here. Just click on the gear icon next to both and click *Install*.

### Step 6 - Setting up a simple blog in Craft

Let's start by creating our blog *section*. A *section* is a collection of *entries*. In Craft, an *entry* is the fundamental unit of content. For our website, every blog post will be a different *entry* of *section* 'blog'. Entries can also be single pages, structures of pages, or anything you want, really.

To Start, navigate to your Craft admin panel, and then to *Settings -> Sections*. Click on *New Section*, and give your section the name 'Blog'. Set the handle to 'blog' and section type to 'Channel'. The uri format should be 'blog/{slug}' and template 'index'. Click *Save* to save this section.

![Screenshot of blog section in Craft](https://raw.githubusercontent.com/Nominom/CraftWithReact/master/tutorial/blog_entry.jpg)

We'll also want to have a home page on our site, so let's create that one as well. Click again on *New Section*, and give this section the name 'Home'. Set the handle to 'home' and section type to 'Single'. Enable the little home checkmark button and select the template 'index'. Click on *Save* again.

![Screenshot of home section in Craft](https://raw.githubusercontent.com/Nominom/CraftWithReact/master/tutorial/home_entry.jpg)

Now, if we want our site to have images, we need to create an asset volume. To create an asset volume, navigate to *Settings -> Assets*, and click on *New volume*. Set the name to 'Images' and handle to 'images'. Set 'Assets in this volume have public URLs' to true, and the base url to '/assets/images'. The volume type should be set to 'Local Folder', and the file system path to '@webroot/assets/images'. Click *Save*.

![Screenshot of asset settings in Craft](https://raw.githubusercontent.com/Nominom/CraftWithReact/master/tutorial/assets_images.JPG)

The next thing to do, is to add some fields to our sections. Fields are units of data associated with an entry. To add some fields, navigate to *Settings -> Fields*, and click on the *Common* group on the left. Click on *New Field*, and make the name of our field 'Post Content'. Set the handle to 'postContent', and the instructions to something like 'The content of this post or page.'

The type of this field will be 'Matrix'. A Matrix field is a field, that contains blocks of different types of data. These blocks can be in any order, and you can have as many blocks as you'd like. For example, our Matrix will contain two types of blocks: text and images. In a more complex website, there could be many more different block types to choose from.

![Screenshot of post content field in Craft](https://raw.githubusercontent.com/Nominom/CraftWithReact/master/tutorial/field_postcontent_1.JPG)

Once our Field type is set to 'Matrix' a Configuration table will appear. Click on *New block type*, and set the name to 'Text' and handle to 'text'. In the field settings, set the name to 'Text' again, and handle to 'text'. Set 'this field is required' to true, and the field type to 'Redactor' or 'Rich Text', depending on your version. If you want to allow inline styles, go to *Advanced* and untick 'Remove inline styles'.

Click on *New block type* again, and set the name to 'Image' and handle to 'image'. Set the name of the field to 'Image' and handle to 'image' again. Tick 'This field is required', and set the field type to 'Assets'. Set 'Restrict uploads to a single folder?' to true, and set the upload location as our asset volume 'Images'. Set 'Restrict allowed file types?' to true, and select 'Image' as the allowed file type. Set the limit to '1'. You can now click *Save* to save our field.

Let's create a few more fields, but this time in a different group. Still in the 'Fields' settings, click on *New Group*, and set the name of the group to 'Blog'. In the blog group, create a new field called 'Feature Image', with the handle of 'featureImage' and a type of 'Assets'. Set again the restriction to our Image asset volume, and the allowed file type to 'Image'. Set the limit to 1. Click *Save*, and add another field called 'Excerpt' with the handle of 'excerpt'. Set the field type to 'Plain Text' and field limit to 100 characters. Click *Save*.

Now that we have some fields, we need to add them to our sections. Navigate to *Settings -> Sections*, and click on *Edit entry types (1)* in our blog section. Click on *Blog*. In the field layout section, drag the entire 'Blog' box into the  layout, and add the 'Post Content' field from 'Common'. Click *Save*.

![Screenshot of blog section field layout in Craft](https://raw.githubusercontent.com/Nominom/CraftWithReact/master/tutorial/fieldlayout_blog.JPG)

Also edit the 'Home' entry type, and drag the 'Common' box into the field layout. Click *Save*.

![Screenshot of home section field layout in Craft](https://raw.githubusercontent.com/Nominom/CraftWithReact/master/tutorial/fieldlayout_home.JPG)

At this point, you should go create some content for testing. Navigate to *Entries* on the side bar, add some text to the Home page and create at least a few blog posts. Add some images to the pages as well.

After you're done, make two more fields in a new group called 'Site Settings'. One image field for the site Logo, with the handle 'logo', and one plain text field for the footer text, with the handle of 'footerText'.

![Screenshot of site settings in Craft](https://raw.githubusercontent.com/Nominom/CraftWithReact/master/tutorial/sitesettings_fields.JPG)

Next, navigate to *Settings -> Globals* and create a new global set. Give it the name 'Site Settings' and handle 'siteSettings'. Add the fields we created to the field layout and click *Save*. You can now choose a logo for your site, and set the footer text in the 'Globals' section in the sidebar.

### Step 7 - Setting up Element API

Setting up Element API is a fairly simple process. All we have to do, is to create a file called **element-api.php** in our project's **config/** folder, and paste the following contents:

```php
<?php

use craft\elements\Entry;
use craft\elements\GlobalSet;
use craft\helpers\UrlHelper;


return [
    'endpoints' => [
		'site.json' => function() {
			return[
				'elementType' => 'craft\elements\GlobalSet',
				'criteria' => ['handle' => 'siteSettings'],
				'transformer' => function(GlobalSet $entry) {
					$logo = $entry->logo->one();

					return [
						'logo' => $logo ? $logo->getUrl(['height' => 100]) : null,
						'footerText' => $entry->footerText,
					];
				},
				'one' => true,
				'meta' => [
					'type' => 'sitedata'
				],
			];
		},
    ]
];
```

This will create an api endpoint to **/site.json** that returns our Site Settings as a json file. What Element API does is whenever the specified endpoint is called, it creates an ['element query'](https://docs.craftcms.com/v3/dev/element-queries/) that finds the requested data from Craft's database. 
* The *elementType* field is the type of element we are trying to find.
* The *criteria* field is our search criteria.
* The *transformer* method transforms the result of the query to an output Json object.
* The *one* parameter tells Element API that we are expecting only a single result
* The *meta* field can contain any arbitrary data that we want to send with the result. Here we are sending the type of this response, which is 'sitedata'

After you've created the file, you can point your browser to http://localhost:3001/site.json , and you should find that craft returns the Site Settings you've entered as a neat json file.

```JSON
// http://localhost:3001/site.json
{
  "logo": "/assets/images/_AUTOx100_crop_center-center_none/test_gradient_1_512.jpg",
  "footerText": "Copyright me",
  "meta": {
    "type": "sitedata"
  }
}
```

Another thing we probably want to know from our website is the different pages that exist. To query for all *Single* entries, we need to modify our code to fetch them:
```php
<?php

use craft\elements\Entry;
use craft\elements\GlobalSet;
use craft\helpers\UrlHelper;
use craft\helpers\ArrayHelper;
use craft\models\Section;

return [
    'endpoints' => [
		'site.json' => function() {
			return[
				'elementType' => 'craft\elements\GlobalSet',
				'criteria' => ['handle' => 'siteSettings'],
				'transformer' => function(GlobalSet $entry) {
					$logo = $entry->logo->one();

					$singleSections = ArrayHelper::where(\Craft::$app->sections->getAllSections(), 
					'type', Section::TYPE_SINGLE);

					$pages = Entry::find()
						->sectionId(ArrayHelper::getColumn($singleSections, 'id'))
						->all();

					$pageInfos = [];

					foreach ($pages as $page) {
						$pageInfos[] = [
							'title' => $page->title,
							'url' => $page->url,
							'jsonUrl' => UrlHelper::url("{$page->slug}.json")
						];
					}
					
					$pageInfos[] = [
						'title' => 'Blog',
						'url' => UrlHelper::url("blog/"),
						'jsonUrl' => UrlHelper::url("blog.json")
					];

					return [
						'logo' => $logo ? $logo->getUrl(['height' => 100]) : null,
						'footerText' => $entry->footerText,
						'pages' => $pageInfos
					];
				},
				'one' => true,
				'meta' => [
					'type' => 'sitedata'
				],
			];
		},
    ]
];
```
The above code makes a second query inside the transformer to find all the *Single* pages. Because our **/blog** endpoint is not a *Single*, we have to add it manually to the list. Now, our endpoint should return something like this:
```JSON
// http://localhost:3001/site.json
{
  "logo": "/assets/images/_AUTOx100_crop_center-center_none/test_gradient_1_512.jpg",
  "footerText": "Copyright me",
  "pages": [
    {
      "title": "Home",
      "url": "http://localhost:3001/",
      "jsonUrl": "http://localhost:3001/home.json"
    },
    {
      "title": "Blog",
      "url": "http://localhost:3001/blog",
      "jsonUrl": "http://localhost:3001/blog.json"
    }
  ],
  "meta": {
    "type": "sitedata"
  }
}
```

The next endpoint we'll add is an endpoint to return the contents of our Home page. Add the *tranformBodyContent* method and the new endpoint definition to your **element-api.php** file:
```php
<?php

use ...

function transformBodyContent(Entry $entry){
	$bodyBlocks = [];
	$blocks = $entry->postContent->all();
	foreach ($blocks as $block) {
		switch ($block->type->handle) {
			case 'text':
				$bodyBlocks[] = [
					'type' => 'text',
					'text' => $block->text->getParsedContent(),
				];
				break;
			case 'image':
				$image = $block->image->one();
				$bodyBlocks[] = [
					'type' => 'image',
					'image' => $image ? $image->getUrl() : null,
				];
				break;
		}
	}
	return $bodyBlocks;
}

return [
    'endpoints' => [
		'site.json' => function() {
			...
		},
		'<_:home\.json|\.json>'  => function() {
			return[
				'elementType' => 'craft\elements\Entry',
				'criteria' => ['slug' => 'home'],
				'transformer' => function(Entry $entry) {
					return [
						'title' => $entry->title,
						'date_published' => $entry->postDate->format(\DateTime::ATOM),
						'date_modified' => $entry->dateUpdated->format(\DateTime::ATOM),
						'content' => transformBodyContent($entry),
					];
				},
				'one' => true,
				'meta' => [
					'type' => 'page'
				],
			];
		},
    ]
]
```

The funny looking endpoint url is just a regex for matching either **/home.json** or **/.json**, this will help our front-end in fetching the correct data without having to make an edge-case condition when the web root is requested.

You might also wonder what the *transformBodyContent* function does. It's a simple helper function to help us parse the body content that is the same field in multiple sections, without having to duplicate a lot of code.

Verify that both http://localhost:3001/.json and http://localhost:3001/home.json work, and send back valid data.

Next, let's create endpoints for both listing blog posts, and fetching the content of a single blog post:
```php
<?php

use ...

function transformBodyContent(Entry $entry){
	...
}


return [
    'endpoints' => [
		'site.json' => function() {
			...
		},
		'<_:home\.json|\.json>'  => function() {
			...
		},
		'blog.json'  => function() {
			return[
				'elementType' => 'craft\elements\Entry',
				'criteria' => [
					'section' => 'blog',
					'orderBy' => 'postDate desc',
				],
				'transformer' => function(Entry $entry) {
					$featureImage = $entry->featureImage->one();

					return [
						'title' => $entry->title,
						'date_published' => $entry->postDate->format(\DateTime::ATOM),
						'date_modified' => $entry->dateUpdated->format(\DateTime::ATOM),
						'url' => $entry->url,
						'jsonUrl' => UrlHelper::url("blog/{$entry->slug}.json"),
						'excerpt' => $entry->excerpt,
						'featureImage' => $featureImage? $featureImage->getUrl() : null,
					];
				},
				'elementsPerPage' => 8,
				'meta' => [
					'type' => 'bloglist'
				],
			];
		},
		'blog/<slug:{slug}>.json'  => function($slug) {
			return[
				'elementType' => 'craft\elements\Entry',
				'criteria' => [
					'section' => 'blog',
					'slug' => $slug
				],
				'transformer' => function(Entry $entry) {
					$featureImage = $entry->featureImage->one();

					return [
						'title' => $entry->title,
						'date_published' => $entry->postDate->format(\DateTime::ATOM),
						'date_modified' => $entry->dateUpdated->format(\DateTime::ATOM),
						'content' => transformBodyContent($entry),
						'excerpt' => $entry->excerpt,
						'featureImage' => $featureImage? $featureImage->getUrl() : null,
					];
				},
				'one' => true,
				'meta' => [
					'type' => 'blogpost'
				],
			];
		},
    ]
];
```
The **/blog.json** endpoint should return a list of blog posts, ordered by their post date. The *elementsPerPage* parameter controls how many results will be sent back. You can fetch older posts with the *page* query parameter, for example: **/blog.json?page=2**.

The **/blog/\<slug\>.json** endpoint returns a single blog post with the specified slug. The slug is usually the title of the blog post but in lower case and spaces replaced with hyphens. Here we are using the *transformBodyContent* function again to convert the post content to json.

The final **element-api.php** should look something like this:
```php
<?php

use craft\elements\Entry;
use craft\elements\GlobalSet;
use craft\helpers\UrlHelper;
use craft\helpers\ArrayHelper;
use craft\models\Section;

function transformBodyContent(Entry $entry){
	$bodyBlocks = [];
	$blocks = $entry->postContent->all();
	foreach ($blocks as $block) {
		switch ($block->type->handle) {
			case 'text':
				$bodyBlocks[] = [
					'type' => 'text',
					'text' => $block->text->getParsedContent(),
				];
				break;
			case 'image':
				$image = $block->image->one();
				$bodyBlocks[] = [
					'type' => 'image',
					'image' => $image ? $image->getUrl() : null,
				];
				break;
		}
	}
	return $bodyBlocks;
}


return [
    'endpoints' => [
		'site.json' => function() {
			return[
				'elementType' => 'craft\elements\GlobalSet',
				'criteria' => ['handle' => 'siteSettings'],
				'transformer' => function(GlobalSet $entry) {
					$logo = $entry->logo->one();

					$singleSections = ArrayHelper::where(\Craft::$app->sections->getAllSections(), 
					'type', Section::TYPE_SINGLE);

					$pages = Entry::find()
						->sectionId(ArrayHelper::getColumn($singleSections, 'id'))
						->all();

					$pageInfos = [];

					foreach ($pages as $page) {
						$pageInfos[] = [
							'title' => $page->title,
							'url' => $page->url,
							'jsonUrl' => UrlHelper::url("{$page->slug}.json")
						];
					}
					
					$pageInfos[] = [
						'title' => 'Blog',
						'url' => UrlHelper::url("blog/"),
						'jsonUrl' => UrlHelper::url("blog.json")
					];

					return [
						'logo' => $logo ? $logo->getUrl(['height' => 100]) : null,
						'footerText' => $entry->footerText,
						'pages' => $pageInfos
					];
				},
				'one' => true,
				'meta' => [
					'type' => 'sitedata'
				],
			];
		},
		'<_:home\.json|\.json>'  => function() {
			return[
				'elementType' => 'craft\elements\Entry',
				'criteria' => ['slug' => 'home'],
				'transformer' => function(Entry $entry) {
					return [
						'title' => $entry->title,
						'date_published' => $entry->postDate->format(\DateTime::ATOM),
						'date_modified' => $entry->dateUpdated->format(\DateTime::ATOM),
						'content' => transformBodyContent($entry),
					];
				},
				'one' => true,
				'meta' => [
					'type' => 'page'
				],
			];
		},
		'blog.json'  => function() {
			return[
				'elementType' => 'craft\elements\Entry',
				'criteria' => [
					'section' => 'blog',
					'orderBy' => 'postDate desc',
				],
				'transformer' => function(Entry $entry) {
					$featureImage = $entry->featureImage->one();

					return [
						'title' => $entry->title,
						'date_published' => $entry->postDate->format(\DateTime::ATOM),
						'date_modified' => $entry->dateUpdated->format(\DateTime::ATOM),
						'url' => $entry->url,
						'jsonUrl' => UrlHelper::url("blog/{$entry->slug}.json"),
						'excerpt' => $entry->excerpt,
						'featureImage' => $featureImage? $featureImage->getUrl() : null,
					];
				},
				'elementsPerPage' => 8,
				'meta' => [
					'type' => 'bloglist'
				],
			];
		},
		'blog/<slug:{slug}>.json'  => function($slug) {
			return[
				'elementType' => 'craft\elements\Entry',
				'criteria' => [
					'section' => 'blog',
					'slug' => $slug
				],
				'transformer' => function(Entry $entry) {
					$featureImage = $entry->featureImage->one();

					return [
						'title' => $entry->title,
						'date_published' => $entry->postDate->format(\DateTime::ATOM),
						'date_modified' => $entry->dateUpdated->format(\DateTime::ATOM),
						'content' => transformBodyContent($entry),
						'excerpt' => $entry->excerpt,
						'featureImage' => $featureImage? $featureImage->getUrl() : null,
					];
				},
				'one' => true,
				'meta' => [
					'type' => 'blogpost'
				],
			];
		},
    ]
];
```

Verify that both endpoints work and return valid data.

This part is over, but join me in the next one where we finally build a React front-end for our blog. 