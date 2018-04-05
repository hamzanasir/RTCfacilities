class MapsController < ApplicationController
  def stuart
    building = Building.where(name: 'Stuart').take
    @rooms = building.rooms
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
      text = "A request for room #{complaint.room.roomNumber} for Stuart was recieved.\n#{complaint.complaint}"
      sendSms(text)
      flash[:notice] = "Your request was successfully submitted."
      redirect_to stuart_url
    else
      flash[:error] = "Request Failed."
      redirect_to stuart_url
    end
  end

  def alumini
    building = Building.where(name: 'Alumini').take
    @rooms = building.rooms
  end
  
  def alumini_room
    room = Room.where(roomNumber: "AM-#{params[:roomNumber]}").take
    if room.nil?
      render json: {'error' => 'true'}
    else
      render json: room.to_json(:include => :complaints )
    end
  end
  
  def alumini_room_post
    complaint = Complaint.new;
    complaint.complaint = params[:complaint]
    complaint.higher = params[:higher] == 'higher'
    complaint.satisfied = false
    complaint.room = Room.where(roomNumber: "AM-#{params[:roomNumber]}").take

    if complaint.save
      text = "A request for room #{complaint.room.roomNumber} for Alumini was recieved.\n#{complaint.complaint}"
      sendSms(text)
      flash[:notice] = "Your request was successfully submitted."
      redirect_to alumini_url
    else
      flash[:error] = "Request Failed."
      redirect_to alumini_url
    end
  end
end
