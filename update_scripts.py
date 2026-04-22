#!/usr/bin/env python3
"""Read unit JSON files and update scripts_data.js"""
import json, re, os, glob

OUTPATH = r'C:\Users\makoto\Documents\GitHub\class-pf-pie-dvd-emulation\scripts_data.js'
DATADIR = r'C:\Users\makoto\Documents\GitHub\class-pf-pie-dvd-emulation\unit_json'

def to_html(icon, title_en, title_ja, content):
    en = [f'<h3>{icon} {title_en}</h3>']
    ja = [f'<h3>{icon} {title_ja}</h3>']
    for c in content:
        s, e, j = c.get('speaker',''), c.get('en',''), c.get('ja','')
        if s:
            if e: en.append(f'<p><span class="speaker">{s}:</span> {e}</p>')
            if j: ja.append(f'<p><span class="speaker">{s}:</span> {j}</p>')
        else:
            if e: en.append(f'<p>{e}</p>')
            if j: ja.append(f'<p>{j}</p>')
    return ''.join(en), ''.join(ja)

def phonics_html(title, content):
    en = [f'<h3>🔤 Phonics: {title}</h3>']
    ja = [f'<h3>🔤 フォニックス: {title}</h3>']
    for c in content:
        en.append(f'<p>{c["en"]}</p>')
        ja.append(f'<p>{c["en"]} - {c["ja"]}</p>')
    return ''.join(en), ''.join(ja)

# Chapter mapping per unit
UNIT_CH = {'Unit 1':1,'Unit 2':13,'Unit 3':27,'Unit 4':37,'Unit 5':51,'Unit 6':64,'Unit 7':77,'Unit 8':90}

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    units = data.get('units', [data]) if 'units' in data else [data]
    updates = {}
    
    for unit_data in units:
        unit_name = unit_data.get('unit','')
        base_ch = UNIT_CH.get(unit_name, 0)
        if not base_ch:
            print(f'  Unknown unit: {unit_name}')
            continue
        
        sections = unit_data.get('sections', [])
        ch = base_ch
        i = 0
        while i < len(sections):
            sec = sections[i]
            sid = sec.get('id','')
            stype = sec.get('type','')
            title = sec.get('title','')
            content = sec.get('content', [])
            note = sec.get('note','')
            
            # Combined practice sections
            if '-1' in sid and stype == 'Practice':
                qa = content
                speech = []
                if i+1 < len(sections) and '-2' in sections[i+1].get('id',''):
                    speech = sections[i+1].get('content', [])
                    i += 1
                en_parts = ['<h3>🎯 Questions and Answers / My Speech</h3>']
                ja_parts = ['<h3>🎯 質問と答え / マイスピーチ</h3>']
                for c in qa:
                    s = c.get('speaker','')
                    en_parts.append(f'<p><span class="speaker">{s}:</span> {c.get("en","")}</p>')
                    ja_parts.append(f'<p><span class="speaker">{s}:</span> {c.get("ja","")}</p>')
                if speech:
                    en_parts.append('<hr>')
                    ja_parts.append('<hr>')
                    for c in speech:
                        s = c.get('speaker','')
                        en_parts.append(f'<p><span class="speaker">{s}:</span> {c.get("en","")}</p>')
                        ja_parts.append(f'<p><span class="speaker">{s}:</span> {c.get("ja","")}</p>')
                updates[ch] = (''.join(en_parts), ''.join(ja_parts))
            elif stype == 'Song':
                e = f'<h3>🎵 {title}</h3>'
                j = f'<h3>🎵 {title}</h3><p>※{note or "日本語訳省略"}</p>'
                updates[ch] = (e, j)
            elif stype in ('Phonics',) and content and 'speaker' not in content[0]:
                e, j = phonics_html(title, content)
                updates[ch] = (e, j)
            elif stype == 'Phonics' and note:
                e = f'<h3>🔤 {title}</h3>'
                j = f'<h3>🔤 {title}</h3><p>※{note}</p>'
                updates[ch] = (e, j)
            elif stype in ('Dialogue','Skit'):
                e, j = to_html('💬', title, title, content)
                updates[ch] = (e, j)
            elif stype == 'Target Chant':
                e, j = to_html('🎯', title, title, content)
                updates[ch] = (e, j)
            elif stype in ('Think Globally','Introduction'):
                e, j = to_html('🌍', title, title, content)
                updates[ch] = (e, j)
            elif content:
                e, j = to_html('📖', title, title, content)
                updates[ch] = (e, j)
            
            ch += 1
            i += 1
    
    return updates

def escape_js(s):
    return s.replace("\\", "\\\\").replace("'", "\\'")

def apply_updates(updates):
    with open(OUTPATH, 'r', encoding='utf-8') as f:
        content = f.read()
    
    for ch, (en_html, ja_html) in sorted(updates.items()):
        en_esc = escape_js(en_html)
        ja_esc = escape_js(ja_html)
        new_line = f"{ch}: {{ en: '{en_esc}', ja: '{ja_esc}' }}"
        pattern = rf'^{ch}: \{{.*\}}[,]?\s*$'
        match = re.search(pattern, content, re.MULTILINE)
        if match:
            old = match.group(0).rstrip()
            suffix = ',' if old.endswith(',') else ''
            content = content.replace(old, new_line + suffix)
            print(f'  Ch {ch}: UPDATED')
        else:
            print(f'  Ch {ch}: NOT FOUND')
    
    with open(OUTPATH, 'w', encoding='utf-8') as f:
        f.write(content)

# Process all JSON files
os.makedirs(DATADIR, exist_ok=True)
all_updates = {}
for jf in sorted(glob.glob(os.path.join(DATADIR, '*.json'))):
    print(f'Processing {os.path.basename(jf)}...')
    all_updates.update(process_file(jf))

if all_updates:
    print(f'\nApplying {len(all_updates)} updates...')
    apply_updates(all_updates)
    # Verify
    import subprocess
    r = subprocess.run(['node','-e',f"new Function(require('fs').readFileSync(r'{OUTPATH}','utf8'));console.log('SYNTAX OK')"], capture_output=True, text=True)
    print(r.stdout.strip() or r.stderr.strip())
else:
    print('No JSON files found in', DATADIR)
print('Done!')
