class MapsController < ApplicationController
  def stuart
    puts params
    if params[:flash] == nil
      @flash = {}
    else
      @flash = params[:flash]
    end
  end
  
  def stuart_room
    room = Room.where(roomNumber: "SB-#{params[:roomNumber]}").take
    if room.nil?
      render json: {'error' => 'true'}
    else
      render json: room.to_json(:include => :complaints )
    end
  end
  
  def stuart_room_post
    complaint = Complaint.new;
    complaint.complaint = params[:complaint]
    complaint.higher = params[:higher] == 'higher'
    complaint.satisfied = false
    complaint.room = Room.where(roomNumber: "SB-#{params[:roomNumber]}").take
    if complaint.save
      redirect_to action: 'stuart', :flash => { :success => "Your request was successfully submitted." }
    else
      redirect_to action: 'stuart', :flash => { :error => "Request Failed." }
    end
  end

  def alumini
  end
end
