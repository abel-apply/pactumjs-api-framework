Feature: Login 

  Background:
    Given I set base URL to "https://dummyjson.com"
    
  Scenario: Login with valid credentials
    When I send a POST request to "/auth/login" with body:
      """
      {
        "username": "emilys",
        "password": "emilyspass"
      }
      """
    Then the response status code should be 200
    And I store the response field "accessToken" as "authToken"
    And I set bearer token "{authToken}"

  Scenario: Get current auth user
    When I send a GET request to "/auth/me"
    Then the response status code should be 200
    And the response body should partially match:
      """
      {
        "id": 1,
        "username": "emilys",
        "email": "emily.johnson@x.dummyjson.com",
        "firstName": "Emily",
        "lastName": "Johnson",
        "gender": "female",
        "image": "https://dummyjson.com/icon/emilys/128"
      }
    """
  