import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'skillbridge.settings')
django.setup()

from accounts.models import User
from accounts.serializers import UserSerializer

try:
    u = User.objects.first()
    if u:
        print(f"Found user: {u.email}")
        data = UserSerializer(u).data
        print("Serializer data success:")
        print(data)
    else:
        print("No user found in database.")
except Exception as e:
    print(f"ERROR: {e}")
    import traceback
    traceback.print_exc()
