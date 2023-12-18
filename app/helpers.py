import re, json


class BodyHelper:
    pattern = r'{{(.*?)}}'

    def replace_placeholder(self, payload, mapping):
        def replace(match):
            key = match.group(1).strip()
            return str(payload.get(key, match.group(0)))

        replaced_mapping = re.sub(self.pattern, replace, mapping)

        return replaced_mapping

    def convert_to_json(self, data_string):
        # data_string = data_string.replace('{{', '"').replace('}}', '"')

        # Replace single quotes with double quotes to make it valid JSON
        data_string = data_string.replace("'", '"')

        # Convert string to JSON
        try:
            json_data = json.loads(data_string)
            return json_data
        except json.JSONDecodeError as e:
            print(f"JSON Decode Error: {e}")
            return None


# testing code
data = {
    'first_name': 'John',
    'last_name': 'Doe',
    'email': 'johndoe@example.com'
}

# Sample mapping
mapping_template = '''
{
    "first_name": {{first_name}},
    "last_name": {{last_name}},
    "email": {{email}}
}
'''

bd = BodyHelper()
# print(bd.replace_placeholder(data, mapping_template))
corrected_textarea_data = '''
{
    "campaign_id": 2,
    "payload": {
        "lp_campaign_id": "8349",
        "lp_supplier_id": "17326",
        "lp_key": "eogzfr0ks6g6z",
        "Firstname": "{{Firstname}}",
        "Lastname": "{{Lastname}}",
        "Phone": "{{Phone}}",
        "Email": "{{Email}}",
        "typeoftaxdebt": "{{typeoftaxdebt}}",
        "Taxsituation": "{{Taxsituation}}",
        "Taxdebtamount": "{{Taxdebtamount}}",
        "state": "{{state}}"
    }
}

'''


# print(bd.convert_to_json(corrected_textarea_data))


class FindAndGetStatus:

    def find_key(self, body, key):
        if isinstance(body, dict):
            if key in body:
                return body[key]
            
            for k, v in body.items():
                item = self.get_key(v, key)
                if item is not None:
                    return item
            
        elif isinstance(body, list):
            for i in body:
                item = self.get_key(i, key)
                if item is not None:
                    return item
        return None

    def get_key(self, body, key):
        data = json.loads(body)
        value = self.find_key(data, key)
        return value

    def find_and_get_status(self, json_body, condition, condition_key, condition_value):
        response = None
        try:
            if condition == "KEY EQUALS WITH":
                condition_key = self.get_key(json_body, condition_key)
                condition_value = condition_key
                if condition_key == condition_value:
                    response = condition_value
            elif condition == "STATUS":
                pass
            else:
                response = "REJECTED"
            
            return response
        except Exception as e:
            return str(e)
        

# driver code
json_data = '''
 {
  "id": "9ac41b5b-d640-406a-9f03-a52974ec8345",
  "lead_id": "kbZ5M4wB8J-QmL7XPaoF",
  "status": "ACCEPTED",
  "code": 0,
  "message": "",
  "buyers": [
    {
      "id": 17325,
      "client": {
        "id": 8929,
        "company": "WBTL.com",
        "email": "austin@webuytaxleads.com",
        "first_name": "Austin",
        "last_name": "Walker",
        "phone": "(724) 713-7018",
        "full_name": "Austin Walker"
      },
      "name": "WBTL Under $10k",
      "sell_price": 10,
      "status": "Accepted",
      "status_id": 1,
      "error_code": 0,
      "error_message": ""
    }
  ],
  "sell_price": 10
}

'''

ob = FindAndGetStatus()
# print(ob.get_key(json_data, "status"))
# print(ob.find_and_get_status(json_data, "KEY EQUALS WITH", "status", "Accepted"))


class PhoneFormat:
    def format_phone_number(self, number, format_type):
        try:
            if number.isdigit():
                if format_type == "STANDARD":
                    formatted_phone = f"({number[0:3]}) {number[3:6]}-{number[6:]}"
                    return formatted_phone
                elif format_type == "INTERNATIONAL":
                    formatted_phone = f"+1 {number[0:3]}-{number[3:6]}-{number[6:]}"
                    return formatted_phone
            else:
                print("Invalid phone number")
        except Exception as e:
            return str(e)


pf = PhoneFormat()
print(pf.format_phone_number("+1 734-785-5744", "STANDARD"))
