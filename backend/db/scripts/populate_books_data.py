import json, re, sys
from random import randint
import asyncio
from typing import Any
from httpx import AsyncClient
import aiofiles


MISSING = object()

def get_val(dict1, dict2, val1, val2):
  v = dict2.get(val2, MISSING)
  if v != MISSING:
    dict1[val1] = v


IGNORE_CHARS_IN_SUBJECT_REGEX = re.compile(r"[.,#_\[\];:]|--|n/a")

queries: list[str] = sys.argv[1:]

if not queries:
  queries = [input('> ')]


fields = [
  'key',

  'author_name',
  # 'author_key',

  'title',
  'subtitle',

  # 'publisher',
  # 'publish_date',

  "language",
  'subject', # #_[];:

  'cover_edition_key',# used to get cover image for book (template: https://covers.openlibrary.org/b/olid/{olid-key}-{size (S/M/L)}.jpg)

  # "ratings_average",
  # 'ratings_count',
  # "ratings_count",
  # "ratings_count_1",
  # "ratings_count_2",
  # "ratings_count_3",
  # "ratings_count_4",
  # "ratings_count_5",

  # 'edition_count',
  # 'edition_key'
]


class MissingDict(dict):
  def __setitem__(self, key: Any, value: Any) -> None:
    if value != MISSING:
      super().__setitem__(key, value)


async def main():
  async def desc_and_pic(client, cover_key, obj_key):
    return await asyncio.gather(
      client.get(f'https://openlibrary.org/works/{obj_key}.json'),
      client.get(f'https://covers.openlibrary.org/b/olid/{cover_key}-M.jpg', follow_redirects=True)
    )

  async def get_details(res):
    nonlocal count
    obj = MissingDict()

    obj['key'] = res['key'].rsplit('/', 1)[-1]

    obj["authorName"] = res.get("author_name", [])
    # obj['author_id'] = res.get('author_key', MISSING)

    obj['title'] = res["title"]
    obj["subtitle"] = res.get("subtitle", MISSING)

    # obj["publisher"] = res.get("publisher", MISSING)
    # obj['publish_date'] = res.get('publish_date', MISSING)

    obj['lang'] = res.get('language', MISSING)

    obj['categories'] = [i for i in res.get('subject', []) if not IGNORE_CHARS_IN_SUBJECT_REGEX.match(i)]

    cover_key = res.get("cover_edition_key", MISSING)

    # if 'key' not in obj:
    #   print(obj)
    desc_res, cover_img_res = await desc_and_pic(client, cover_key, obj['key'])

    if cover_key != MISSING:
      async with aiofiles.open(f'./cover_imgs/{cover_key}.jpg', 'wb+') as f:
        async for data, _ in  cover_img_res.content.iter_chunks():
          await f.write(data)

      obj['coverImage'] = f'/cover_imgs/{cover_key}.jpg'

    work_details = desc_res.json()

    desc =  work_details.get('description', MISSING)
    if isinstance(desc, dict):
      desc = desc['value']

    if desc != MISSING:
      obj['description'] = desc.replace('\r\n', '\n').replace('https://openlibrary.org/works', '/book')

    # obj['revision'] = work_details.get("revision", MISSING)

    # if 'ratings_average' in res:
    #   ratings = obj["ratings"] = {}
    #   ratings['avg'] = res['ratings_average']
    #   ratings['total_count'] = res["ratings_count"]
    #   ratings['individual_rating'] = [res[f'ratings_count_{i}'] for i in range(1, 6)]

    # editions = obj["editions"] = {}

    # if "edition_key" in obj:
    #   editions["total_count"] = obj["edition_count"]
    #   editions["list"] = obj["edition_key"]

    obj['price'] = randint(60, 600) * 10# + 0.1 * randint(1, 99) # rupees
    obj['unitsInStock'] = randint(1, 30)

    count += 1
    print(f'\r{count}/{total_results} completed.', end='')
    return obj

  lst = []
  proxies = {
    # 'http':	'130.61.171.71',
    # 'http':	'130.162.148.105',
    # 'http':	'102.222.51.105',
    # 'http':	'133.18.234.13',
    # 'http':	'1.20.250.128',
    # 'http':	'103.105.54.99',
    # 'http':	'103.137.111.231',
  }

  async with AsyncClient(timeout=6.0, proxies=proxies) as client:
    for query in queries:
      count = 0
      query = query.lower()
      query_url = f'https://openlibrary.org/search.json?title={query.replace(' ', '+')}&fields={','.join(fields)}'
      r = await client.get(query_url, follow_redirects=True)
      res_json = r.json()
      res_list = res_json['docs']
      # total_results = res_json['numFound']
      total_results = len(res_json['docs'])
      print(f'Found {total_results} results for {query!r}, got {len(res_list)} results in a single request')
      lst = await asyncio.gather(*(get_details(res) for res in res_list))
      print()

      with open(f'{query}.json', 'w+') as f:
        json.dump(lst, f, indent=2)


asyncio.run(main())
