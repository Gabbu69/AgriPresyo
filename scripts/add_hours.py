import re, os

HOURS = {
    'v_veg_1': "openTime: '04:00', closeTime: '16:00'",
    'v_veg_2': "openTime: '05:00', closeTime: '17:00'",
    'v_veg_3': "openTime: '03:30', closeTime: '15:00'",
    'v_veg_4': "openTime: '05:30', closeTime: '16:30'",
    'v_veg_5': "openTime: '06:00', closeTime: '15:00'",
    'v_veg_6': "openTime: '04:30', closeTime: '13:00'",
    'v_fruit_1': "openTime: '05:30', closeTime: '18:00'",
    'v_fruit_2': "openTime: '05:00', closeTime: '17:30'",
    'v_fruit_3': "openTime: '05:00', closeTime: '17:00'",
    'v_fruit_4': "openTime: '06:00', closeTime: '18:00'",
    'v_fruit_5': "openTime: '06:00', closeTime: '16:00'",
    'v_fruit_6': "openTime: '04:30', closeTime: '14:00'",
}

path = os.path.join(os.path.dirname(__file__), 'constants.tsx')
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

def add_hours(m):
    full = m.group(0)
    vid = m.group(1)
    if 'openTime' in full:
        return full
    hours = HOURS.get(vid)
    if not hours:
        return full
    idx = full.rfind('}')
    before = full[:idx].rstrip()
    if before.endswith(','):
        before = before[:-1].rstrip()
    return before + ', ' + hours + ' }'

pattern = r"\{\s*id:\s*'(v_(?:veg|fruit)_\d+)'[^}]+\}"
result = re.sub(pattern, add_hours, content)

with open(path, 'w', encoding='utf-8') as f:
    f.write(result)

count = len(re.findall(r"openTime:", result))
print(f"Total openTime entries: {count}")
