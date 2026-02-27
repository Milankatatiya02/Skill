from django.core.management.base import BaseCommand
from accounts.models import Skill


class Command(BaseCommand):
    help = 'Seed the database with initial skills'

    def handle(self, *args, **kwargs):
        skills = [
            'Graphic Design',
            'Video Editing',
            'Content Writing',
            'Data Entry',
            'Programming',
        ]
        for name in skills:
            Skill.objects.get_or_create(name=name)
            self.stdout.write(self.style.SUCCESS(f'  + {name}'))
        self.stdout.write(self.style.SUCCESS('\nAll skills seeded successfully!'))
