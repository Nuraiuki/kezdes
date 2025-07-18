from db import SessionLocal, Event, init_db
from datetime import datetime, timedelta
import random

init_db()
db = SessionLocal()

categories = [
    ("Музыка", "#FFBA00"),
    ("Образование", "#6D9773"),
    ("Спорт", "#BB8A52"),
    ("Тусовка", "#0C3B2E"),
    ("Мастер-класс", "#FFBA00"),
    ("Кино", "#6D9773"),
    ("Театр", "#BB8A52"),
]

locations = [
    "Клуб 'Пульс'", "Университет, ауд. 204", "Стадион 'Юность'", "Коворкинг 'Точка'", "Парк 'Дружба'",
    "Кинотеатр 'Синема'", "Театр 'Современник'", "Кафе 'Листва'", "Библиотека №3", "Арт-пространство 'Loft'"
]

descriptions = [
    "Уникальное событие для всех, кто любит новые знакомства и яркие эмоции!",
    "Приходи учиться, общаться и вдохновляться!",
    "Турнир для настоящих фанатов спорта и активного отдыха.",
    "Вечер живой музыки и выступлений молодых артистов.",
    "Мастер-класс от лучших экспертов города.",
    "Фильм, который стоит посмотреть всем!",
    "Театральная постановка, которая не оставит равнодушным.",
    "Тёплая атмосфера, новые друзья и интересные беседы.",
]

image_urls = [
    f"https://picsum.photos/seed/event{i}/400/240" for i in range(1, 26)
]

base_date = datetime.now() + timedelta(days=2)

for i in range(25):
    cat, _ = categories[i % len(categories)]
    event = Event(
        title=f"Событие #{i+1} — {cat}",
        category=cat,
        description=descriptions[i % len(descriptions)],
        location=locations[i % len(locations)],
        lat=str(51.09 + (i % 5) * 0.01),
        lng=str(71.41 + (i % 5) * 0.01),
        date=base_date + timedelta(days=i),
        image_url=image_urls[i],
        rsvp_going=0,
        rsvp_maybe=0,
        rsvp_cant=0
    )
    db.add(event)
db.commit()
db.close()
print("25 событий успешно добавлены!")

print('До сидирования:', db.query(Event).filter(Event.category=='Национальные').count(), 'событий категории Национальные')

ethnic_events = [
    {
        'title': 'Мастер-класс: Вязание лошадки из шерсти',
        'category': 'Национальные',
        'description': 'Научитесь создавать традиционные казахские игрушки своими руками!',
        'location': 'Культурный центр "Шаңырақ"',
        'lat': '51.10', 'lng': '71.42',
        'date': base_date + timedelta(days=30),
        'image_url': 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
    },
    {
        'title': 'Мастер-класс: Готовим баурсаки',
        'category': 'Национальные',
        'description': 'Секреты приготовления настоящих казахских баурсаков от шеф-повара!',
        'location': 'Кафе "Дастархан"',
        'lat': '51.11', 'lng': '71.43',
        'date': base_date + timedelta(days=31),
        'image_url': 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80',
    },
    {
        'title': 'Мастер-класс: Изготовление домбры',
        'category': 'Национальные',
        'description': 'Погрузитесь в процесс создания главного казахского инструмента — домбры!',
        'location': 'Музей народного творчества',
        'lat': '51.12', 'lng': '71.44',
        'date': base_date + timedelta(days=32),
        'image_url': 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80',
    },
    {
        'title': 'Мастер-класс: Роспись тюбетеек',
        'category': 'Национальные',
        'description': 'Освойте искусство росписи национальных головных уборов — тюбетеек.',
        'location': 'Арт-пространство "Ornek"',
        'lat': '51.13', 'lng': '71.45',
        'date': base_date + timedelta(days=33),
        'image_url': 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=400&q=80',
    },
    {
        'title': 'Мастер-класс: Плетение казахских ковров',
        'category': 'Национальные',
        'description': 'Традиционные техники плетения ковров и орнаментов.',
        'location': 'Центр ремёсел',
        'lat': '51.14', 'lng': '71.46',
        'date': base_date + timedelta(days=34),
        'image_url': 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80',
    },
    {
        'title': 'Мастер-класс: Сборка мини-юрты',
        'category': 'Национальные',
        'description': 'Соберите свою мини-юрту и узнайте о быте кочевников.',
        'location': 'Музей истории',
        'lat': '51.15', 'lng': '71.47',
        'date': base_date + timedelta(days=35),
        'image_url': 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=400&q=80',
    },
    {
        'title': 'Мастер-класс: Казахская каллиграфия',
        'category': 'Национальные',
        'description': 'Погрузитесь в искусство национальной каллиграфии и орнамента.',
        'location': 'Библиотека №1',
        'lat': '51.16', 'lng': '71.48',
        'date': base_date + timedelta(days=36),
        'image_url': 'https://images.unsplash.com/photo-1465101178521-c1a9136a3fd9?auto=format&fit=crop&w=400&q=80',
    },
    {
        'title': 'Мастер-класс: Национальные танцы',
        'category': 'Национальные',
        'description': 'Овладейте основами казахских народных танцев.',
        'location': 'Танцевальная студия "Айша"',
        'lat': '51.17', 'lng': '71.49',
        'date': base_date + timedelta(days=37),
        'image_url': 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=400&q=80',
    },
    {
        'title': 'Мастер-класс: Изготовление национальных украшений',
        'category': 'Национальные',
        'description': 'Создайте уникальные украшения в казахском стиле.',
        'location': 'Ювелирная мастерская',
        'lat': '51.18', 'lng': '71.50',
        'date': base_date + timedelta(days=38),
        'image_url': 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80',
    },
    {
        'title': 'Мастер-класс: Готовим бешбармак',
        'category': 'Национальные',
        'description': 'Приготовьте главное блюдо казахской кухни — бешбармак!',
        'location': 'Кулинарная школа "Аспаз"',
        'lat': '51.19', 'lng': '71.51',
        'date': base_date + timedelta(days=39),
        'image_url': 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80',
    },
    {
        'title': 'Мастер-класс: Игра на кобызе',
        'category': 'Национальные',
        'description': 'Познакомьтесь с древним казахским инструментом — кобызом.',
        'location': 'Музыкальная школа',
        'lat': '51.20', 'lng': '71.52',
        'date': base_date + timedelta(days=40),
        'image_url': 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80',
    },
    {
        'title': 'Мастер-класс: Казахские сувениры своими руками',
        'category': 'Национальные',
        'description': 'Сделайте сувенир с национальным орнаментом для себя или в подарок.',
        'location': 'Арт-студия "Шабыт"',
        'lat': '51.21', 'lng': '71.53',
        'date': base_date + timedelta(days=41),
        'image_url': 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80',
    },
]

for ev in ethnic_events:
    unique_suffix = str(random.randint(10000, 99999))
    try:
        event = Event(
            title=f"{ev['title']} #{unique_suffix}",
            category=ev['category'],
            description=ev['description'],
            location=ev['location'],
            lat=ev['lat'],
            lng=ev['lng'],
            date=ev['date'],
            image_url=ev['image_url'],
            rsvp_going=0,
            rsvp_maybe=0,
            rsvp_cant=0
        )
        db.add(event)
    except Exception as e:
        print(f'Ошибка при добавлении события: {ev["title"]} — {e}')

db.commit()
print('После сидирования:', db.query(Event).filter(Event.category=='Национальные').count(), 'событий категории Национальные')
db.close()
print("12 этнических событий успешно добавлены!") 