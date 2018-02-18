require 'test_helper'

class MapsControllerTest < ActionDispatch::IntegrationTest
  test "should get stuart" do
    get maps_stuart_url
    assert_response :success
  end

  test "should get alumini" do
    get maps_alumini_url
    assert_response :success
  end

end
