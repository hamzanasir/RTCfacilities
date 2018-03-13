require 'test_helper'

class AdminControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get admin_index_url
    assert_response :success
  end

  test "should get stuart" do
    get admin_stuart_url
    assert_response :success
  end

  test "should get alumini" do
    get admin_alumini_url
    assert_response :success
  end

end
