import os
import json
import re

DATASET_DIR = r"c:\Users\Vinay Singh\Desktop\hack\Unstoppabl-e-HACKS\dataset"
OUTPUT_FILE = r"c:\Users\Vinay Singh\Desktop\hack\Unstoppabl-e-HACKS\data\documents.json"
PROJECTS_FILE = r"c:\Users\Vinay Singh\Desktop\hack\Unstoppabl-e-HACKS\data\projects.json"

def get_project_name(name):
    name_lower = name.lower()
    if 'tathastu i' in name_lower and 'ii' not in name_lower: return 'Tathastu I' # basic check
    if 'tathastu ii' in name_lower: return 'Tathastu II'
    if 'advitiya' in name_lower or 'advitya' in name_lower: return 'Advitiya Heights'
    if 'legend' in name_lower: return 'Legend III'
    if 'sector 104' in name_lower: return 'Sector 104 Development'
    # Fallback heuristics
    if 'tower' in name_lower:
        # Try to guess project from tower filename if it doesn't have project name
        # But most in dataset seem to be just "Tower 1.pdf" which is ambiguous.
        # However, looking at file list, "Tower 1.pdf" etc might belong to a default project?
        # Let's mark as Unknown for now or Group them.
        pass
    return 'Unknown Project'

def get_document_type(name):
    name_lower = name.lower()
    if 'brochure' in name_lower or 'braucher' in name_lower: return 'Brochure'
    if 'floor plan' in name_lower or 'tower' in name_lower: return 'Floor Plan'
    if 'site plan' in name_lower or 'layout' in name_lower: return 'Site Plan'
    if 'carpet area' in name_lower: return 'Carpet Area'
    if 'elevation' in name_lower: return 'Elevation'
    if 'affidavit' in name_lower: return 'Legal Document'
    if 'newspaper' in name_lower: return 'Advertisement'
    if 'drawing' in name_lower: return 'Technical Drawing'
    return 'Other'

documents = []
files = os.listdir(DATASET_DIR)

for f in files:
    if os.path.isdir(os.path.join(DATASET_DIR, f)):
        continue
        
    project_name = get_project_name(f)
    doc_type = get_document_type(f)
    
    # Heuristic for files like "Tower 1.pdf" which don't have project name
    if project_name == 'Unknown Project':
        # Maybe check if it's a generic file potentially belonging to one of the known projects?
        # For now, we will leave it as Unknown Project, but later we might map it.
        pass

    documents.append({
        "filename": f,
        "project": project_name,
        "type": doc_type,
        "path": f"dataset/{f}" # The web app might need to serve this directory
    })

# Write documents.json
with open(OUTPUT_FILE, 'w') as f:
    json.dump(documents, f, indent=4)

print(f"Generated {OUTPUT_FILE} with {len(documents)} entries.")

# Check projects
with open(PROJECTS_FILE, 'r') as f:
    projects = json.load(f)

existing_projects = {p['name'] for p in projects}
found_projects = {d['project'] for d in documents}

print("Existing Projects:", existing_projects)
print("Found Projects:", found_projects)
