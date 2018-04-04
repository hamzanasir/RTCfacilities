class ApplicationController < ActionController::Base
  protect_from_forgery with: :null_session
  helper_method :logged_in?

  def authenticated?
    if !(session[:email].class == NilClass)
      return Admin.where(email: Marshal.load(session[:email])).exists?
    else
      return false
    end
  end
end
