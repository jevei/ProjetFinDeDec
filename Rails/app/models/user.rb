class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable

  validates :email, uniqueness: true, presence: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  #validate :validate_email
  validates :firstname, presence: true
  validates :lastname, presence: true
  validates :address, presence: true
  validates :city, presence: true
  validates :postal_code, presence: true
  validates :province, presence: true
  validates :phone_number, presence: true
  validates :picture_name, presence: true
  has_one_attached :picture
  has_many :commands
  has_many :conversation
  has_many :message
  has_one :cart

  # Fonctionnalité privé au modèle
  private
  def validate_email
    unless self.email =~ /\A([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})\z/i
      errors.add(:email, "is not an email")
    end
  end

  def picture_url
    Rails.application.routes.url_helpers.rails_blob_path(self.picture, only_path: true)
  end

end
