class SessionsController < ApplicationController
  def create
    render json: request.env['omniauth.auth'].to_json
  end
end
