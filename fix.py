import re

with open("src/components/admin/HospitalInfrastructureManager.tsx", "r") as f:
    text = f.read()

# Fix the specific error
text = text.replace("setFormData({ type: 'posto_saude', is_active: true, capacity_beds: 0 );", "setFormData({ type: 'posto_saude', is_active: true, capacity_beds: 0 });")
# Fix similar occurrences if any
text = text.replace("setFormData(infra );", "setFormData(infra);")
text = text.replace("fetchServices(infra.id );", "fetchServices(infra.id);")
text = text.replace("setEditingId(infra.id );", "setEditingId(infra.id);")

with open("src/components/admin/HospitalInfrastructureManager.tsx", "w") as f:
    f.write(text)
