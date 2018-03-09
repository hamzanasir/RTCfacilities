class MapsController < ApplicationController
  def stuart
  end
  
  def stuart_room
    room = Room.where(roomNumber: "SB-#{params[:roomNumber]}").take
    if room.nil?
      render json: {'error' => 'true'}
    else
      render json: room.to_json(:include => :complaints )
    end
  end

  def alumini
  end
end
