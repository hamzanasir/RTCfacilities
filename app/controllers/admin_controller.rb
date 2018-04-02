class AdminController < ApplicationController
  def index
  end

  def stuart
    building = Building.where(name: 'Stuart').take
    @rooms = building.rooms.includes(:complaints)
  end
  
  def delete_complaint
    complaint = Complaint.find(params[:id]).destroy
    if complaint.destroyed?
      render json: {'error' => 'false'}
    else
      render json: {'error' => 'true'}
    end
  end

  def alumini
    building = Building.where(name: 'Alumini').take
    @rooms = building.rooms.includes(:complaints)
  end
end
