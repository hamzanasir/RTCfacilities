class AdminController < ApplicationController
  def index
    if !(authenticated?)
      redirect_to login_url
    end
  end

  def stuart
    if !(authenticated?)
      redirect_to login_url
    else
      building = Building.where(name: 'Stuart').take
      @rooms = building.rooms.includes(:complaints)
    end
  end
  
  def delete_complaint
    if !(authenticated?)
      render json: {'error' => 'true'}
    else
      complaint = Complaint.find(params[:id]).destroy
      if complaint.destroyed?
        render json: {'error' => 'false'}
      else
        render json: {'error' => 'true'}
      end
    end
  end

  def alumini
    if !(authenticated?)
      redirect_to login_url
    else
      building = Building.where(name: 'Alumini').take
      @rooms = building.rooms.includes(:complaints)
    end
  end
end
