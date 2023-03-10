class Product < ApplicationRecord
    validates :category, presence: true, allow_blank: false
    validates :price, presence: true, allow_blank: false, format: { with: /\A\d+(?:\.\d{0,2})?\z/ }, numericality: {greater_than: 0}
    validates :title, presence: true, allow_blank: false
    validates :description, presence: true, allow_blank: false
    validates :quantity, presence: true, allow_blank: false, numericality: {greater_than_or_equal_to: 0}
    validates :animal_type, presence: true, allow_blank: false
    has_one_attached :picture
    has_many :cart_products
    has_many :carts, through: :cart_products

    def picture_url
        Rails.application.routes.url_helpers.rails_blob_path(self.picture, only_path: true)
    end
end
