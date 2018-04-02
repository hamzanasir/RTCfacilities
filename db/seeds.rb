# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

require 'nokogiri'

Complaint.delete_all
Room.delete_all
Building.delete_all

buildings = {
  'Stuart' => {
    'SB' => ['00', '01', '02']
  },
  'Alumini' => {
    'AM' => ['00', '01', '02']
  }
}

buildings.each do |building, floors|
  new_building = Building.create(:name => building, :initial => floors.keys[0])
  floors.each do |initial, floors_arr|
    floors_arr.each do |floor|
      doc = Nokogiri::XML(File.open("public/svg/#{initial}-#{floor}.svg"))
      doc.css('svg path').each do |room|
        roomNum = initial + '-' + room['id'].split('-', 2)[1].strip()
        Room.create(:roomNumber => roomNum, :building => new_building)
      end
    end
  end
end
