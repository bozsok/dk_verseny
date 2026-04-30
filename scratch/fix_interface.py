import sys

file_path = r'd:\dev\dk_verseny\src\content\grade4\styles\Interface.css'

with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
    content = f.read()

old_text = """/* TOP HUD */
.dkv-g4-top-hud {
    position: absolute;
    top: 0;
    width: 100%;
    z-index: 50;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 2rem;
    box-sizing: border-box;
    pointer-events: none;
}"""

new_text = """/* TOP HUD */
.dkv-g4-top-hud {
    position: absolute;
    top: 0;
    width: 100%;
    z-index: 3000; /* Megemelve 50-ről, hogy a modálisok felett legyen */
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 2rem;
    box-sizing: border-box;
    pointer-events: none;
}

/* Speciális igazítás: Ha a modálisban a Finálé feladat fut, kerüljön alulra */
.dkv-g4-task-modal-overlay:has(.dkv-finale-task) {
    align-items: flex-end;
    background: rgba(0, 0, 0, 0.4); /* Kevésbé sötét, hogy átlátszódjon a HUD */
    backdrop-filter: blur(4px); /* Enyhébb blur */
}"""

if old_text in content:
    new_content = content.replace(old_text, new_text)
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Successfully updated Interface.css")
else:
    # Try with different line endings or slight variations
    print("Could not find old_text precisely. Searching for parts...")
    if ".dkv-g4-top-hud {" in content:
         print("Found .dkv-g4-top-hud, but block match failed.")
    else:
         print("Could not find .dkv-g4-top-hud at all.")
    sys.exit(1)
