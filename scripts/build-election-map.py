"""Build the game's pixel map from the attributed Georef/IGN provincial geometry.

uvx --with pillow==12.0.0 python scripts/build-election-map.py
"""
import json
import math
from pathlib import Path
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / 'art/geography/argentina-provincias.geojson'
TARGET = ROOT / 'apps/web/src/assets/argentina-pixel-map.json'
WIDTH, HEIGHT, SAMPLE = 224, 252, 4


def projection(ring):
    if max(point[1] for point in ring) < -60:
        def antarctic(point):
            lon, lat = point
            radius = (90 + lat) * 2
            angle = math.radians(lon + 50)
            return 177 + radius * math.sin(angle), 232 - radius * math.cos(angle)
        return antarctic
    if min(point[0] for point in ring) > -50:
        return lambda point: (143 + (point[0] + 42) * 3.6, 101 + (-point[1] - 52) * 5)
    return lambda point: (8 + (point[0] + 74) * math.cos(math.radians(40)) * 6.3,
                          6 + (-point[1] - 21.5) * 6.3)


def runs(image, value):
    result = []
    for y in range(HEIGHT):
        x = 0
        while x < WIDTH:
            if image.getpixel((x, y)) != value:
                x += 1
                continue
            start = x
            while x < WIDTH and image.getpixel((x, y)) == value:
                x += 1
            result.append([start, y, x - start])
    return result


def main():
    features = json.loads(SOURCE.read_text(encoding='utf-8'))['features']
    if len(features) != 24:
        raise ValueError('Expected 24 electoral districts')
    labels = Image.new('L', (WIDTH, HEIGHT))
    for feature in sorted(features, key=lambda item: item['properties']['id'] == '02'):
        geometry = feature['geometry']
        polygons = [geometry['coordinates']] if geometry['type'] == 'Polygon' else geometry['coordinates']
        layer = Image.new('L', (WIDTH * SAMPLE, HEIGHT * SAMPLE))
        drawing = ImageDraw.Draw(layer)
        for polygon in polygons:
            project = projection(polygon[0])
            for index, ring in enumerate(polygon):
                points = [tuple(round(value * SAMPLE) for value in project(point)) for point in ring]
                drawing.polygon(points, fill=255 if index == 0 else 0)
        small = Image.new('L', (WIDTH, HEIGHT))
        for y in range(HEIGHT):
            for x in range(WIDTH):
                small.putpixel((x, y), layer.getpixel((x * SAMPLE + SAMPLE // 2, y * SAMPLE + SAMPLE // 2)))
        labels.paste(int(feature['properties']['id']), mask=small)
    # CABA's real footprint is retained; this separate inset makes it selectable.
    ImageDraw.Draw(labels).rectangle((146, 48, 157, 57), fill=2)
    edges = Image.new('L', (WIDTH, HEIGHT))
    for y in range(1, HEIGHT - 1):
        for x in range(1, WIDTH - 1):
            value = labels.getpixel((x, y))
            if value and any(labels.getpixel((x + dx, y + dy)) != value for dx, dy in [(1, 0), (0, 1)]):
                edges.putpixel((x, y), 1)
    provinces = [{
        'id': feature['properties']['id'],
        'name': feature['properties']['nombre'],
        'runs': runs(labels, int(feature['properties']['id'])),
    } for feature in features]
    if any(not province['runs'] for province in provinces):
        raise ValueError('A district disappeared during rasterization')
    data = {'width': WIDTH, 'height': HEIGHT, 'provinces': provinces, 'borders': runs(edges, 1)}
    TARGET.write_text(json.dumps(data, ensure_ascii=False, separators=(',', ':')) + '\n', encoding='utf-8')
    print(f"Built {len(provinces)} districts, {sum(len(p['runs']) for p in provinces)} pixel runs")


if __name__ == '__main__':
    main()
