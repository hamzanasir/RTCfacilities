class SessionsController < ApplicationController
  def create
    if Admin.where(email: request.env['omniauth.auth']['info']['email']).exists?
      session[:email] = Marshal.dump request.env['omniauth.auth']['info']['email']
      redirect_to admin_url, notice: "Welcome #{request.env['omniauth.auth']['info']['name']}."
    else
      redirect_to login_url, notice: "Failed to login. You do not have admin access."
    end
  end
  
  def login
  end
  
  def logout
    session.delete :email
    
    redirect_to login_url
  end
end
