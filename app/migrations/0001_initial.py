# Generated by Django 4.1.5 on 2023-11-26 09:34

import datetime
from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='BudgetCapSetting',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateField(default=datetime.date.today)),
                ('updated_at', models.DateField(auto_now_add=True)),
                ('daily_cap', models.PositiveBigIntegerField(blank=True, default=0, null=True)),
                ('weekly_cap', models.PositiveBigIntegerField(blank=True, null=True)),
                ('monthly_cap', models.PositiveBigIntegerField(blank=True, null=True)),
                ('total_cap', models.PositiveBigIntegerField(blank=True, null=True)),
            ],
            options={
                'ordering': ['created_at'],
            },
        ),
        migrations.CreateModel(
            name='Campaign',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateField(default=datetime.date.today)),
                ('updated_at', models.DateField(default=datetime.date.today)),
                ('campaign_uid', models.CharField(max_length=550, unique=True)),
                ('campaign_title', models.CharField(blank=True, max_length=255, null=True, unique=True)),
                ('is_active', models.BooleanField(default=True)),
                ('is_active_filter', models.BooleanField(blank=True, default=False, null=True)),
                ('is_active_ping', models.BooleanField(blank=True, default=False, null=True)),
                ('total_posted', models.PositiveIntegerField(blank=True, default=0, null=True)),
                ('total_accepted', models.PositiveIntegerField(blank=True, default=0, null=True)),
                ('total_rejected', models.PositiveIntegerField(blank=True, default=0, null=True)),
                ('total_duplicated', models.PositiveIntegerField(blank=True, default=0, null=True)),
            ],
            options={
                'verbose_name': 'Campaign',
                'verbose_name_plural': 'Campaigns',
                'ordering': ['created_at'],
            },
        ),
        migrations.CreateModel(
            name='Client',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateField(default=datetime.date.today)),
                ('updated_at', models.DateField(auto_now_add=True)),
                ('name', models.CharField(max_length=255)),
                ('email', models.CharField(blank=True, max_length=255, null=True, unique=True)),
                ('phone_number', models.CharField(blank=True, max_length=255, null=True)),
                ('company_name', models.CharField(blank=True, max_length=255, null=True)),
            ],
            options={
                'ordering': ['created_at'],
            },
        ),
        migrations.CreateModel(
            name='DebtRelief',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateField(default=datetime.date.today)),
                ('updated_at', models.DateField(default=datetime.date.today)),
                ('debt_amount', models.CharField(max_length=255)),
                ('firstName', models.CharField(max_length=255)),
                ('lastName', models.CharField(max_length=255)),
                ('email', models.CharField(max_length=255, unique=True)),
                ('phone', models.CharField(max_length=255, unique=True)),
                ('state', models.CharField(max_length=255)),
            ],
            options={
                'verbose_name': 'DebtRelief',
                'verbose_name_plural': 'DebtReliefs',
                'ordering': ['created_at'],
            },
        ),
        migrations.CreateModel(
            name='Distribution',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateField(default=datetime.date.today)),
                ('updated_at', models.DateField(default=datetime.date.today)),
                ('title', models.CharField(max_length=255)),
            ],
            options={
                'ordering': ['created_at'],
            },
        ),
        migrations.CreateModel(
            name='FieldType',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateField(default=datetime.date.today)),
                ('updated_at', models.DateField(default=datetime.date.today)),
                ('type_name', models.CharField(max_length=255)),
            ],
            options={
                'ordering': ['-created_at'],
            },
        ),
        migrations.CreateModel(
            name='FieldValue',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateField(default=datetime.date.today)),
                ('updated_at', models.DateField(default=datetime.date.today)),
                ('value_title', models.CharField(max_length=255)),
            ],
            options={
                'verbose_name': 'FieldValue',
                'verbose_name_plural': 'FieldValues',
                'ordering': ['-id'],
            },
        ),
        migrations.CreateModel(
            name='Headers',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateField(default=datetime.date.today)),
                ('updated_at', models.DateField(auto_now_add=True)),
                ('header_key', models.CharField(max_length=255, null=True)),
                ('header_value', models.CharField(max_length=255, null=True)),
            ],
            options={
                'verbose_name': 'Header',
                'verbose_name_plural': 'Headers',
                'ordering': ['-created_at'],
            },
        ),
        migrations.CreateModel(
            name='Lead',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateField(default=datetime.date.today)),
                ('updated_at', models.DateField(default=datetime.date.today)),
                ('lead_id', models.UUIDField(default=uuid.uuid4, editable=False, unique=True)),
                ('payload', models.TextField(blank=True, null=True)),
                ('is_test', models.BooleanField(default=False)),
                ('status', models.CharField(blank=True, choices=[('ACCEPTED', 'accepted'), ('DUPLICATED', 'duplicated'), ('REJECTED', 'rejected')], max_length=255, null=True)),
                ('ping_status', models.CharField(blank=True, choices=[('ACCEPTED', 'accepted'), ('DUPLICATED', 'duplicated'), ('REJECTED', 'rejected')], max_length=255, null=True)),
                ('response_log', models.CharField(blank=True, max_length=255, null=True)),
                ('ping_response_log', models.CharField(blank=True, max_length=255, null=True)),
                ('supplier_source', models.CharField(blank=True, max_length=255, null=True)),
                ('campaign', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='app.campaign')),
            ],
            options={
                'verbose_name': 'Lead',
                'verbose_name_plural': 'Leads',
                'ordering': ['-created_at'],
            },
        ),
        migrations.CreateModel(
            name='LeadsCapSetting',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateField(default=datetime.date.today)),
                ('updated_at', models.DateField(auto_now_add=True)),
                ('daily_cap', models.PositiveBigIntegerField(blank=True, default=0, null=True)),
                ('weekly_cap', models.PositiveBigIntegerField(blank=True, null=True)),
                ('monthly_cap', models.PositiveBigIntegerField(blank=True, null=True)),
                ('total_cap', models.PositiveBigIntegerField(blank=True, null=True)),
            ],
            options={
                'ordering': ['created_at'],
            },
        ),
        migrations.CreateModel(
            name='Logic',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateField(default=datetime.date.today)),
                ('updated_at', models.DateField(default=datetime.date.today)),
                ('slug', models.SlugField()),
                ('logic_key', models.CharField(max_length=255, null=True)),
                ('operator', models.CharField(choices=[('EXACT EQUALS', 'exact equals'), ('NOT EQUALS', 'not equals'), ('CONTAINS', 'contains'), ('DOES NOT CONTAINS', 'does not contains')], max_length=255, null=True)),
                ('logic_value', models.CharField(max_length=255, null=True)),
            ],
            options={
                'verbose_name': 'Logic',
                'verbose_name_plural': 'Logics',
                'ordering': ['-id'],
            },
        ),
        migrations.CreateModel(
            name='PostType',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateField(default=datetime.date.today)),
                ('updated_at', models.DateField(auto_now_add=True)),
                ('post_name', models.CharField(max_length=255, unique=True)),
            ],
            options={
                'verbose_name': 'PostType',
                'verbose_name_plural': 'PostTypes',
                'ordering': ['-created_at'],
            },
        ),
        migrations.CreateModel(
            name='Record',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateField(default=datetime.datetime.now)),
                ('updated_at', models.DateField(default=datetime.datetime.now)),
                ('total_ingested', models.PositiveIntegerField(blank=True, default=0, null=True)),
                ('total_accepted', models.PositiveIntegerField(blank=True, default=0, null=True)),
                ('total_rejected', models.PositiveIntegerField(blank=True, default=0, null=True)),
                ('total_duplicated', models.PositiveIntegerField(blank=True, default=0, null=True)),
                ('profit', models.FloatField(blank=True, default=0.0, null=True)),
            ],
            options={
                'verbose_name': 'Record',
                'verbose_name_plural': 'Records',
                'ordering': ['-created_at'],
            },
        ),
        migrations.CreateModel(
            name='StaticValue',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateField(default=datetime.date.today)),
                ('updated_at', models.DateField(auto_now_add=True)),
                ('value_name', models.CharField(max_length=255)),
            ],
            options={
                'ordering': ['-id'],
            },
        ),
        migrations.CreateModel(
            name='TestCampaign',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateField(default=datetime.date.today)),
                ('updated_at', models.DateField(default=datetime.date.today)),
                ('firstName', models.CharField(max_length=255)),
                ('lastName', models.CharField(max_length=255)),
                ('email', models.CharField(max_length=255, unique=True)),
                ('phone', models.CharField(max_length=255, unique=True)),
            ],
            options={
                'verbose_name': 'TestCampaign',
                'verbose_name_plural': 'TestCampaigns',
                'ordering': ['-created_at'],
            },
        ),
        migrations.CreateModel(
            name='TimeZone',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(default=datetime.datetime.now)),
                ('updated_at', models.DateTimeField(default=datetime.datetime.now)),
                ('timezone_title', models.CharField(max_length=255)),
            ],
            options={
                'verbose_name': 'TimeZone',
                'verbose_name_plural': 'TimeZones',
                'ordering': ['-created_at'],
            },
        ),
        migrations.CreateModel(
            name='Supplier',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateField(default=datetime.date.today)),
                ('updated_at', models.DateField(auto_now_add=True)),
                ('supplier_name', models.CharField(max_length=255, null=True)),
                ('source', models.CharField(choices=[('EXTERNAL', 'EXTERNAL'), ('INTERNAL', 'INTERNAL')], max_length=255, null=True)),
                ('lead_volume_daily_cap', models.PositiveBigIntegerField(blank=True, default=0, null=True)),
                ('lead_volume_weekly_cap', models.PositiveBigIntegerField(blank=True, default=0, null=True)),
                ('lead_volume_monthly_cap', models.PositiveBigIntegerField(blank=True, default=0, null=True)),
                ('budget_daily_cap', models.PositiveBigIntegerField(blank=True, default=0, null=True)),
                ('budget_weekly_cap', models.PositiveBigIntegerField(blank=True, default=0, null=True)),
                ('budget_monthly_cap', models.PositiveBigIntegerField(blank=True, default=0, null=True)),
                ('total_request_sent', models.PositiveBigIntegerField(blank=True, default=0, null=True)),
                ('price', models.PositiveIntegerField(default=0)),
                ('campaign', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='suppliers', to='app.campaign')),
                ('timezone', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='app.timezone')),
            ],
            options={
                'verbose_name': 'Supplier',
                'verbose_name_plural': 'Suppliers',
                'ordering': ['-created_at'],
            },
        ),
        migrations.CreateModel(
            name='StaticField',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateField(default=datetime.date.today)),
                ('updated_at', models.DateField(auto_now_add=True)),
                ('field_name', models.CharField(max_length=255)),
                ('values', models.ManyToManyField(blank=True, to='app.staticvalue')),
            ],
            options={
                'verbose_name': 'StaticField',
                'verbose_name_plural': 'StaticFields',
                'ordering': ['created_at'],
            },
        ),
        migrations.CreateModel(
            name='Segmentation',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateField(default=datetime.date.today)),
                ('updated_at', models.DateField(default=datetime.date.today)),
                ('slug', models.SlugField()),
                ('leads', models.ManyToManyField(blank=True, to='app.lead')),
                ('logic', models.ManyToManyField(blank=True, to='app.logic')),
            ],
            options={
                'verbose_name': 'Segmentation',
                'verbose_name_plural': 'Segmentations',
                'ordering': ['-id'],
            },
        ),
        migrations.CreateModel(
            name='PostSetting',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateField(default=datetime.date.today)),
                ('updated_at', models.DateField(auto_now_add=True)),
                ('post_url', models.CharField(max_length=255)),
                ('request_method', models.CharField(choices=[('GET', 'GET'), ('POST', 'POST'), ('PUT', 'PUT')], max_length=255)),
                ('payload_type', models.CharField(choices=[('Json', 'Json'), ('Form', 'Form'), ('XML', 'Xml')], max_length=555)),
                ('payload_builder', models.CharField(blank=True, max_length=10000, null=True)),
                ('headers', models.ManyToManyField(blank=True, to='app.headers')),
            ],
            options={
                'verbose_name': 'PostSetting',
                'verbose_name_plural': 'PostSettings',
                'ordering': ['created_at'],
            },
        ),
        migrations.CreateModel(
            name='Filter',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateField(default=datetime.date.today)),
                ('updated_at', models.DateField(default=datetime.date.today)),
                ('filter_type', models.CharField(choices=[('GLOBAL', 'GLOBAL'), ('SUPPLIER LEVEL', 'SUPPLIER LEVEL'), ('BUYER LEVEL', 'BUYER LEVEL')], max_length=255, null=True)),
                ('key', models.CharField(max_length=255, null=True)),
                ('conditions', models.CharField(choices=[('EQUAL TO', 'EQUAL TO'), ('NOT EQUAL TO', 'NOT EQUAL TO'), ('CONTAINS', 'CONTAINS'), ('HAS REGEX', 'HAS REGEX')], max_length=255, null=True)),
                ('value', models.CharField(max_length=255, null=True)),
                ('result', models.CharField(blank=True, choices=[('ACCEPT LEADS', 'ACCEPT LEADS'), ('REJECT LEADS', 'REJECT LEADS')], max_length=255, null=True)),
                ('campaign', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='app.campaign')),
            ],
            options={
                'verbose_name': 'Filter',
                'verbose_name_plural': 'Filters',
                'ordering': ['-created_at'],
            },
        ),
        migrations.CreateModel(
            name='Field',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateField(default=datetime.date.today)),
                ('updated_at', models.DateField(default=datetime.date.today)),
                ('field_name', models.CharField(max_length=255)),
                ('field_type', models.CharField(choices=[('Text', 'text'), ('List', 'list'), ('Date', 'date'), ('Integer', 'integer'), ('Email', 'email'), ('Postal Code', 'postal code'), ('Zip Code', 'zip code')], max_length=255, null=True)),
                ('post_status', models.CharField(choices=[('Required', 'required'), ('Optional', 'optional')], max_length=255)),
                ('field_visiblity', models.BooleanField(blank=True, default=True, null=True)),
                ('campaign', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='fields', to='app.campaign')),
                ('field_values', models.ManyToManyField(blank=True, to='app.fieldvalue')),
            ],
            options={
                'verbose_name': 'Field',
                'verbose_name_plural': 'Fields',
                'ordering': ['-created_at'],
            },
        ),
        migrations.AddField(
            model_name='campaign',
            name='distribution_type',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='app.distribution'),
        ),
        migrations.AddField(
            model_name='campaign',
            name='ping_fields',
            field=models.ManyToManyField(blank=True, related_name='ping_fields', to='app.field'),
        ),
        migrations.CreateModel(
            name='Buyer',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateField(default=datetime.date.today)),
                ('updated_at', models.DateField(auto_now_add=True)),
                ('buyer_name', models.CharField(max_length=255, null=True)),
                ('lead_volume_daily_cap', models.PositiveBigIntegerField(blank=True, default=0, null=True)),
                ('lead_volume_weekly_cap', models.PositiveBigIntegerField(blank=True, default=0, null=True)),
                ('lead_volume_monthly_cap', models.PositiveBigIntegerField(blank=True, default=0, null=True)),
                ('budget_daily_cap', models.PositiveBigIntegerField(blank=True, default=0, null=True)),
                ('budget_weekly_cap', models.PositiveBigIntegerField(blank=True, default=0, null=True)),
                ('budget_monthly_cap', models.PositiveBigIntegerField(blank=True, default=0, null=True)),
                ('delivery_method', models.CharField(blank=True, choices=[('DIRECT POST', 'DIRECT POST'), ('PING POST', 'PING POST'), ('EMAIL LEADS', 'EMAIL LEADS'), ('STORE LEADS', 'STORE LEADS')], max_length=255, null=True)),
                ('post_url', models.CharField(max_length=255, null=True)),
                ('ping_url', models.CharField(blank=True, max_length=255, null=True)),
                ('ping_body', models.CharField(blank=True, max_length=1000, null=True)),
                ('request_method', models.CharField(choices=[('POST', 'POST'), ('GET', 'GET')], max_length=255, null=True)),
                ('payload_type', models.CharField(choices=[('JSON', 'json'), ('Form', 'form'), ('XML', 'xml')], default='JSON', max_length=255, null=True)),
                ('body', models.TextField(blank=True, null=True)),
                ('response_type', models.CharField(blank=True, max_length=255, null=True)),
                ('price', models.PositiveIntegerField(default=0, null=True)),
                ('accepted_condition', models.CharField(choices=[('KEY EQUALS WITH', 'KEY EQUALS WITH'), ('STATUS CODE', 'STATUS CODE'), ('KEY CONTAINS', 'KEY CONTAINS')], max_length=255, null=True)),
                ('accepted_condition_key', models.CharField(max_length=255, null=True)),
                ('accepted_condition_value', models.CharField(max_length=255, null=True)),
                ('duplicate_condition', models.CharField(choices=[('KEY EQUALS WITH', 'KEY EQUALS WITH'), ('STATUS CODE', 'STATUS CODE'), ('KEY CONTAINS', 'KEY CONTAINS')], max_length=255, null=True)),
                ('duplicate_condition_key', models.CharField(max_length=255, null=True)),
                ('duplicate_condition_value', models.CharField(max_length=255, null=True)),
                ('ingested', models.PositiveIntegerField(blank=True, default=0, null=True)),
                ('total_sell', models.PositiveIntegerField(blank=True, default=0, null=True)),
                ('total_accepted', models.PositiveIntegerField(blank=True, default=0, null=True)),
                ('total_rejected', models.PositiveIntegerField(blank=True, default=0, null=True)),
                ('total_duplicated', models.PositiveIntegerField(blank=True, default=0, null=True)),
                ('campaign', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='buyers', to='app.campaign')),
                ('headers', models.ManyToManyField(blank=True, to='app.headers')),
                ('timezone', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='app.timezone')),
            ],
            options={
                'verbose_name': 'Buyer',
                'verbose_name_plural': 'Buyers',
                'ordering': ['created_at'],
            },
        ),
    ]
