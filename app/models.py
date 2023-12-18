from django.db import models
from datetime import date, datetime
import random, string
import uuid


class Distribution(models.Model):
    created_at = models.DateField(default=date.today)
    updated_at = models.DateField(default=date.today)    
    title = models.CharField(max_length=255)
    
    class Meta:
        ordering = ["created_at"]
    
    def __str__(self):
        return self.title
    
    @staticmethod
    def get_all_distribution(self):
        return Distribution.objects.all()


class FieldValue(models.Model):
    created_at = models.DateField(default=date.today)
    updated_at = models.DateField(default=date.today)
    value_title = models.CharField(max_length=255)
    
    class Meta:
        ordering = ["-id"]
        verbose_name = "FieldValue"
        verbose_name_plural = "FieldValues"

    def __str__(self):
        return self.value_title
    

class FieldType(models.Model):
    created_at = models.DateField(default=date.today)
    updated_at = models.DateField(default=date.today)
    type_name = models.CharField(
        max_length=255)
    
    class Meta:
        ordering  = ["-created_at"]
        
    def __str__(self):
        return self.type_name


class Client(models.Model):
    created_at = models.DateField(default=date.today)
    updated_at = models.DateField(auto_now_add=True)
    name = models.CharField(max_length=255)
    email = models.CharField(max_length=255, unique=True, null=True, blank=True)
    phone_number = models.CharField(max_length=255, null=True, blank=True)
    company_name = models.CharField(max_length=255, null=True, blank=True)
    
    class Meta:
        ordering = ["created_at"]
        
    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if self.name != None:
            super(Client, self).save(*args, **kwargs)
        else:
            return None


class LeadsCapSetting(models.Model):
    created_at = models.DateField(default=date.today)
    updated_at = models.DateField(auto_now_add=True)
    daily_cap = models.PositiveBigIntegerField(default=0, null=True, blank=True)
    weekly_cap = models.PositiveBigIntegerField(null=True, blank=True)
    monthly_cap = models.PositiveBigIntegerField(null=True, blank=True)
    total_cap = models.PositiveBigIntegerField(null=True, blank=True)
    
    class Meta:
        ordering = ["created_at"]
        
    def __str__(self):
        return str(self.id)


class BudgetCapSetting(models.Model):
    created_at = models.DateField(default=date.today)
    updated_at = models.DateField(auto_now_add=True)
    daily_cap = models.PositiveBigIntegerField(default=0, null=True, blank=True)
    weekly_cap = models.PositiveBigIntegerField(null=True, blank=True)
    monthly_cap = models.PositiveBigIntegerField(null=True, blank=True)
    total_cap = models.PositiveBigIntegerField(null=True, blank=True)
    
    class Meta:
        ordering = ["created_at"]

    def __str__(self):
        return str(self.id)


class StaticValue(models.Model):
    created_at = models.DateField(default=date.today)
    updated_at = models.DateField(auto_now_add=True)
    value_name = models.CharField(max_length=255)
    
    class Meta:
        ordering = ["-id"]
        
    def __str__(self):
        return self.value_name


class StaticField(models.Model):
    created_at = models.DateField(default=date.today)
    updated_at = models.DateField(auto_now_add=True)
    field_name = models.CharField(max_length=255)
    values = models.ManyToManyField(StaticValue, blank=True)
    
    class Meta:
        ordering = ["created_at"]
        verbose_name = "StaticField"
        verbose_name_plural = "StaticFields"
    
    def __str__(self):
        return self.field_name


class PostType(models.Model):
    created_at = models.DateField(default=date.today)
    updated_at = models.DateField(auto_now_add=True)
    post_name = models.CharField(max_length=255, unique=True)
    
    class Meta:
        ordering = ["-created_at"]
        verbose_name = "PostType"
        verbose_name_plural = "PostTypes"
        
    def __str__(self):
        return self.post_name


class Headers(models.Model):
    created_at = models.DateField(default=date.today)
    updated_at = models.DateField(auto_now_add=True)
    header_key = models.CharField(max_length=255, null=True)
    header_value = models.CharField(max_length=255, null=True)
    
    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Header"
        verbose_name_plural = "Headers"
        
    def __str__(self):
        return f"{self.header_key} + {self.header_value}"
    

class PostSetting(models.Model):
    created_at = models.DateField(default=date.today)
    updated_at = models.DateField(auto_now_add=True)
    post_url = models.CharField(max_length=255)
    request_method = models.CharField(max_length=255, choices=(
        ("GET", "GET"),
        ("POST", "POST"),
        ("PUT", "PUT")
    ))
    payload_type = models.CharField(max_length=555, choices=(
        ("Json", "Json"), ("Form", "Form"),  ("XML", "Xml")
    ))
    payload_builder = models.CharField(max_length=10000, null=True, blank=True)
    
    # headers
    headers = models.ManyToManyField(Headers, blank=True)
    # reponse_type = models.CharField()
    
    class Meta:
        ordering = ["created_at"]
        verbose_name = "PostSetting"
        verbose_name_plural = "PostSettings"
        
    def __str__(self):
        return self.post_url
    """_summary_
    Need to find a new solution. A better solution for generating payload builder.
    Returns:
        _type_: json or form fields
    """


class Campaign(models.Model):
    created_at = models.DateField(default=date.today)
    updated_at = models.DateField(default=date.today)
    campaign_uid = models.CharField(unique=True, max_length=550)
    campaign_title = models.CharField(max_length=255, null=True, blank=True)
    # public_name = models.CharField(max_length=255, null=True, blank=True)
    distribution_type = models.ForeignKey(Distribution, on_delete=models.SET_NULL, null=True, blank=True)
    is_active = models.BooleanField(default=True)

    # filter activation
    is_active_filter = models.BooleanField(null=True, blank=True, default=False)
    # ping/post
    is_active_ping = models.BooleanField(null=True, blank=True, default=False)
    ping_fields = models.ManyToManyField("app.Field", blank=True, related_name="ping_fields")

    # campaign records
    total_posted = models.PositiveIntegerField(default=0, null=True, blank=True)
    total_accepted = models.PositiveIntegerField(default=0, null=True, blank=True)
    total_rejected = models.PositiveIntegerField(default=0, null=True, blank=True)
    total_duplicated = models.PositiveIntegerField(default=0, null=True, blank=True)
    # fields = models.ManyToManyField(Field, blank=True)
    # supplier = models.ForeignKey(Supplier, on_delete=models.SET_NULL, null=True)
    # buyer = models.ForeignKey(Buyer, on_delete=models.SET_NULL, null=True)
    
    class Meta:
        ordering = ["created_at"]
        verbose_name = "Campaign"
        verbose_name_plural = "Campaigns"
        
    def generate_campaign_id(self):
        length=12
        return "".join(random.choices(string.ascii_lowercase, k=length))
    
    def save(self, *args, **kwargs):
        self.campaign_uid = self.generate_campaign_id()
        super(Campaign, self).save(*args, **kwargs)
        
    def __str__(self):
        return self.campaign_title

    """status

    Returns:
        _type_: _model status
        status: pending model.
        description: need to find a  better relation with campaign and leads
    """
    

class Field(models.Model):
    created_at = models.DateField(default=date.today)
    updated_at = models.DateField(default=date.today)
    field_name = models.CharField(max_length=255)
    field_type = models.CharField(max_length=255, null=True, choices=(
        ("Text", "text"),
        ("List", "list"),
        ("Date", "date"),
        ("Integer", "integer"),
        ("Email", "email"),
        ("Postal Code", "postal code"),
        ("Zip Code", "zip code")
    ))
    post_status = models.CharField(max_length=255, choices=(
        ("Required", "required"),
        ("Optional", "optional")
    ))
    field_visiblity = models.BooleanField(default=True, null=True, blank=True)
    field_values = models.ManyToManyField(FieldValue, blank=True)
    campaign = models.ForeignKey(Campaign, on_delete=models.CASCADE, null=True, related_name="fields")
    
    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Field"
        verbose_name_plural = "Fields"

    def __str__(self):
        return self.field_name


class TimeZone(models.Model):
    created_at = models.DateTimeField(default=datetime.now)
    updated_at = models.DateTimeField(default=datetime.now)
    timezone_title = models.CharField(max_length=255)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "TimeZone"
        verbose_name_plural = "TimeZones"

    def __str__(self):
        return self.timezone_title

    
class Supplier(models.Model):
    created_at = models.DateField(default=date.today)
    updated_at = models.DateField(auto_now_add=True)

    # client = models.ForeignKey(Client, on_delete=models.SET_NULL, null=True, blank=True)
    supplier_name = models.CharField(max_length=255, null=True)
    timezone = models.ForeignKey(TimeZone, on_delete=models.SET_NULL, null=True, blank=True)
    campaign = models.ForeignKey(
        Campaign, on_delete=models.SET_NULL, null=True, related_name="suppliers")
    # public_name = models.CharField(max_length=255, null=True, blank=True)

    # source
    source = models.CharField(max_length=255, null=True, choices=(
        ("EXTERNAL", "EXTERNAL"),
        ("INTERNAL", "INTERNAL")
    ))

    # lead volume data column
    lead_volume_daily_cap = models.PositiveBigIntegerField(default=0, null=True, blank=True)
    lead_volume_weekly_cap = models.PositiveBigIntegerField(default=0, null=True, blank=True)
    lead_volume_monthly_cap = models.PositiveBigIntegerField(default=0, null=True, blank=True)
   
    # Budget Cap
    budget_daily_cap = models.PositiveBigIntegerField(default=0, null=True, blank=True)
    budget_weekly_cap = models.PositiveBigIntegerField(default=0, null=True, blank=True)
    budget_monthly_cap = models.PositiveBigIntegerField(default=0, null=True, blank=True)
    
    total_request_sent = models.PositiveBigIntegerField(null=True, blank=True, default=0)
    price = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Supplier"
        verbose_name_plural = "Suppliers"
        
    def __str__(self):
        return str(self.supplier_name)
    
    
class Buyer(models.Model):
    created_at = models.DateField(default=date.today)
    updated_at = models.DateField(auto_now_add=True)
    # client = models.ForeignKey(Client, on_delete=models.SET_NULL, null=True, blank=True)
    buyer_name = models.CharField(max_length=255, null=True)
    campaign = models.ForeignKey(Campaign, on_delete=models.SET_NULL, null=True, related_name="buyers")
    # lead volume data column
    lead_volume_daily_cap = models.PositiveBigIntegerField(default=0, null=True, blank=True)
    lead_volume_weekly_cap = models.PositiveBigIntegerField(default=0, null=True, blank=True)
    lead_volume_monthly_cap = models.PositiveBigIntegerField(default=0, null=True, blank=True)
   
    # Budget Cap
    budget_daily_cap = models.PositiveBigIntegerField(default=0, null=True, blank=True)
    budget_weekly_cap = models.PositiveBigIntegerField(default=0, null=True, blank=True)
    budget_monthly_cap = models.PositiveBigIntegerField(default=0, null=True, blank=True)
    # static_fields = models.ManyToManyField(StaticField, blank=True)
    
    # delivery method column
    delivery_method = models.CharField(max_length=255, null=True, blank=True, choices=(
        ("DIRECT POST", "DIRECT POST"),
        ("PING POST", "PING POST"),
        ("EMAIL LEADS", "EMAIL LEADS"),
        ("STORE LEADS", "STORE LEADS")
    ))
    # direct post
    post_url = models.CharField(max_length=255, null=True)
    # ping url
    ping_url = models.CharField(max_length=255, null=True, blank=True)
    ping_body = models.CharField(max_length=1000, null=True, blank=True)
    request_method = models.CharField(max_length=255, null=True, choices=(
        ("POST", "POST"),
        ("GET", "GET"),
    ))
    payload_type = models.CharField(max_length=255, null=True, default="JSON", choices=(
        ("JSON", "json"),
        ("Form", "form"),
        ("XML", "xml")
    ))
    body = models.TextField(null=True, blank=True)
    headers = models.ManyToManyField(Headers, blank=True)
    
    response_type = models.CharField(max_length=255, null=True, blank=True)
    price = models.PositiveIntegerField(default=0, null=True)
    timezone = models.ForeignKey(TimeZone, on_delete=models.SET_NULL, null=True, blank=True)
    
    # accepted
    accepted_condition = models.CharField(max_length=255, null=True, choices=(
        ("KEY EQUALS WITH", "KEY EQUALS WITH"),
        ("STATUS CODE", "STATUS CODE"),
        ("KEY CONTAINS", "KEY CONTAINS")
    ))
    accepted_condition_key = models.CharField(max_length=255, null=True)
    accepted_condition_value = models.CharField(max_length=255, null=True)
    
    # duplicate
    duplicate_condition = models.CharField(max_length=255, null=True, choices=(
        ("KEY EQUALS WITH", "KEY EQUALS WITH"),
        ("STATUS CODE", "STATUS CODE"),
        ("KEY CONTAINS", "KEY CONTAINS")
    ))
    duplicate_condition_key = models.CharField(max_length=255, null=True)
    duplicate_condition_value = models.CharField(max_length=255, null=True)
    
    # ingestion and total sell column
    ingested = models.PositiveIntegerField(default=0, null=True, blank=True)
    total_sell = models.PositiveIntegerField(default=0, null=True, blank=True)
    total_accepted = models.PositiveIntegerField(default=0, null=True, blank=True)
    total_rejected = models.PositiveIntegerField(default=0, null=True, blank=True)
    total_duplicated = models.PositiveIntegerField(default=0, null=True, blank=True)
    # ping post
    # email
    # manual store leads coming soon
    
    class Meta:
        ordering = ["created_at"]
        verbose_name = "Buyer"
        verbose_name_plural = "Buyers"
        
    def __str__(self):
        return str(self.buyer_name)
    
    
class Lead(models.Model):
    created_at = models.DateField(default=date.today)
    updated_at = models.DateField(default=date.today)
    lead_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    campaign = models.ForeignKey(Campaign, on_delete=models.SET_NULL, null=True)
    payload = models.TextField(null=True, blank=True)
    is_test = models.BooleanField(default=False)
    status = models.CharField(max_length=255, null=True, blank=True, choices=(
        ("ACCEPTED", "accepted"),
        ("DUPLICATED", "duplicated"),
        ("REJECTED", "rejected")
    ))
    ping_status = models.CharField(max_length=255, null=True, blank=True, choices=(
        ("ACCEPTED", "accepted"),
        ("DUPLICATED", "duplicated"),
        ("REJECTED", "rejected")
    ))
    response_log = models.CharField(max_length=255, null=True, blank=True)
    ping_response_log = models.CharField(max_length=255, null=True, blank=True)

    supplier_source = models.CharField(max_length=255, null=True, blank=True)
    
    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Lead"
        verbose_name_plural = "Leads"
        
    def __str__(self):
        return f"Created-at: {self.created_at} Lead Id: {self.lead_id}"
    

class Filter(models.Model):
    CONDITION_CHOICES = (
        ("EQUAL TO", "EQUAL TO"),
        ("NOT EQUAL TO", "NOT EQUAL TO"),
        ("CONTAINS", "CONTAINS"),
        ("HAS REGEX", "HAS REGEX")
    )
    FILTER_CHOICES = (
        ("GLOBAL", "GLOBAL"),
        ("SUPPLIER LEVEL", "SUPPLIER LEVEL"),
        ("BUYER LEVEL", "BUYER LEVEL")
    )

    created_at = models.DateField(default=date.today)
    updated_at = models.DateField(default=date.today)
    campaign = models.ForeignKey(Campaign, on_delete=models.SET_NULL, null=True)
    filter_type = models.CharField(max_length=255,
                                   null=True, choices=FILTER_CHOICES)
    key = models.CharField(max_length=255, null=True)
    conditions = models.CharField(max_length=255, null=True, choices=CONDITION_CHOICES)
    value = models.CharField(max_length=255, null=True)

    result = models.CharField(max_length=255, null=True, blank=True, choices=(
        ("ACCEPT LEADS", "ACCEPT LEADS"),
        ("REJECT LEADS", "REJECT LEADS")
    ))

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Filter"
        verbose_name_plural = "Filters"

    def __str__(self):
        return self.filter_type


class Record(models.Model):
    created_at = models.DateField(default=datetime.now)
    updated_at = models.DateField(default=datetime.now)
    total_ingested = models.PositiveIntegerField(default=0, null=True, blank=True)
    total_accepted = models.PositiveIntegerField(default=0, null=True, blank=True)
    total_rejected = models.PositiveIntegerField(default=0, null=True, blank=True)
    total_duplicated = models.PositiveIntegerField(default=0, null=True, blank=True)
    profit = models.FloatField(default=0.0, null=True, blank=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Record"
        verbose_name_plural = "Records"

    def __str__(self):
        return str(self.id)


class TestCampaign(models.Model):
    created_at = models.DateField(default=date.today)
    updated_at = models.DateField(default=date.today)
    firstName = models.CharField(max_length=255)
    lastName = models.CharField(max_length=255)
    email = models.CharField(max_length=255, unique=True)
    phone = models.CharField(max_length=255, unique=True)
    
    class Meta:
        ordering = ["-created_at"]
        verbose_name = "TestCampaign"
        verbose_name_plural = "TestCampaigns"
        
    def __str__(self):
        return f"{self.firstName} + {self.lastName}"


class Logic(models.Model):
    created_at = models.DateField(default=date.today)
    updated_at = models.DateField(default=date.today)
    slug = models.SlugField()
    logic_key = models.CharField(max_length=255, null=True)
    operator = models.CharField(max_length=255, null=True, choices=(
        ("EXACT EQUALS", "exact equals"),
        ("NOT EQUALS", "not equals"),
        ("CONTAINS", "contains"),
        ("DOES NOT CONTAINS", "does not contains")
    ))
    logic_value = models.CharField(max_length=255, null=True)

    class Meta:
        ordering = ["-id"]
        verbose_name = "Logic"
        verbose_name_plural = "Logics"

    def __str__(self):
        return f"{self.slug}"

    def save(self, *args, **kwargs):
        self.slug = "".join(random.choices(string.ascii_uppercase + string.digits, k=8))
        super(Logic, self).save(*args, **kwargs)


class Segmentation(models.Model):
    created_at = models.DateField(default=date.today)
    updated_at = models.DateField(default=date.today)
    slug = models.SlugField()
    logic = models.ManyToManyField(Logic, blank=True)
    leads = models.ManyToManyField(Lead, blank=True)

    class Meta:
        ordering = ["-id"]
        verbose_name = "Segmentation"
        verbose_name_plural = "Segmentations"

    def __str__(self):
        return f"Segmentation ID: {self.id}"

    def save(self, *args, **kwargs):
        self.slug = "".join(random.choices(string.ascii_uppercase + string.digits, k=8))
        super(Segmentation, self).save(*args, **kwargs)


# custom internal campaigns
class DebtRelief(models.Model):
    created_at = models.DateField(default=date.today)
    updated_at = models.DateField(default=date.today)
    debt_amount = models.CharField(max_length=255)
    firstName = models.CharField(max_length=255)
    lastName = models.CharField(max_length=255)
    email = models.CharField(max_length=255, unique=True)
    phone = models.CharField(max_length=255, unique=True)
    state = models.CharField(max_length=255)

    class Meta:
        ordering = ["created_at"]
        verbose_name = "DebtRelief"
        verbose_name_plural = "DebtReliefs"

    def __str__(self):
        return f"{self.firstName} {self.lastName}"


class HomeSecurity(models.Model):
    created_at = models.DateField(default=date.today)
    property_type = models.CharField(max_length=255)
    property_size = models.CharField(max_length=255)
    many_doors = models.CharField(max_length=255)
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    phone = models.CharField(max_length=255, unique=True)
    email = models.CharField(max_length=255, unique=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "HomeSecurity"
        verbose_name_plural = "HomeSecurity"

    def __str__(self):
        return f"{self.first_name} {self.last_name}"