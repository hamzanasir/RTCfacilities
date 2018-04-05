require 'twilio-ruby'

class ApplicationController < ActionController::Base
  helper_method :sendSms

  def authenticated?
    if !(session[:email].class == NilClass)
      return Admin.where(email: Marshal.load(session[:email])).exists?
    else
      return false
    end
  end
  
  def sendSms(body)
    client = Twilio::REST::Client.new ENV['TWILIO_SID'], ENV['TWILIO_TOKEN']
    puts ENV['TWILIO_SID']
    puts ENV['TWILIO_TOKEN']
    puts ENV.to_json
    client.api.account.messages.create(
      from: '+16304739945',
      to: '+16306772468',
      body: body
    )
  end
end
