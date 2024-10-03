import requests, json, re
from random import randint

IGNORE_CHARS_IN_SUBJECT_REGEX = re.compile(r"[.,#_\[\];:]|--|n/a")
query = input('> ').replace(' ', '+')

fields = [
  'key',

  'author_name',
  'author_key',

  'title',
  'subtitle',

  'publisher',
  'publish_date',

  "language",
  'subject', # #_[];:

  'cover_edition_key',# used to get cover image for book (template: https://covers.openlibrary.org/b/olid/{olid-key}-{size (S/M/L)}.jpg)

  "ratings_average",
  'ratings_count',
  "ratings_count",
  "ratings_count_1",
  "ratings_count_2",
  "ratings_count_3",
  "ratings_count_4",
  "ratings_count_5",

  # 'edition_count',
  # 'edition_key'
]


r = requests.get(
  f'https://openlibrary.org/search.json?title={query}&fields={','.join(fields)}',
  allow_redirects=True
)

res_json = r.json()

total_results = res_json['numFound']

print(f'Found {total_results} results')

count = 1

lst = []

for res in res_json['docs']:
  obj = {}

  print(f'\r{count}/{total_results} completed.', end='')

  obj['key'] = res['key'].rsplit('/', 1)[-1]

  obj["author_name"] = res.get("author_name", None)
  obj['author_id'] = res.get('author_key', None)

  obj['title'] = res["title"]
  obj["subtitle"] = res.get("subtitle", None)

  obj["publisher"] = res.get("publisher", None)
  obj['publish_date'] = res.get('publish_date', None)

  obj['lang'] = res.get('language', None)

  obj['subject'] = [i for i in res.get('subject', []) if not IGNORE_CHARS_IN_SUBJECT_REGEX.match(i)]

  cover_key = res.get("cover_edition_key", None)
  obj['cover_img'] = None

  if cover_key:
    with open(f'./cover_imgs/{cover_key}.jpg', 'wb') as f:
      r3 = requests.get(f'https://covers.openlibrary.org/b/olid/{cover_key}-M.jpg')
      r3.raise_for_status()
      f.write(r3.text.encode())

    obj['cover_img'] = f'./cover_imgs/{cover_key}.jpg'

  work_details = requests.get(f'https://openlibrary.org/works/{obj['key']}.json').json()

  obj['description'] = work_details.get('description', None)
  obj['revision'] = work_details.get("revision", None)

  ratings = obj["ratings"] = {}

  if 'ratings_average' in obj:
    ratings['avg'] = obj['ratings_average']
    ratings['total_count'] = obj["ratings_count"]
    ratings['individual_rating'] = [obj[f'ratings_count_{i}'] for i in range(1, 6)]

  # editions = obj["editions"] = {}

  # if "edition_key" in obj:
  #   editions["total_count"] = obj["edition_count"]
  #   editions["list"] = obj["edition_key"]

  obj['price'] = randint(600, 6000)# + 0.1 * randint(1, 99) # rupees
  obj['in_stock'] = randint(1, 30)

  lst.append(obj)

print()

with open('data.json', 'a+') as f:
  f.write(json.dumps(lst, indent=2))
