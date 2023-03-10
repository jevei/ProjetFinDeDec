# frozen_string_literal: true

class Users::RegistrationsController < Devise::RegistrationsController
  # before_action :configure_sign_up_params, only: [:create]
  # before_action :configure_account_update_params, only: [:update]
  def create
    build_resource(sign_up_params)
    #resource.picture.attach(io: File.open(Rails.root + "app/assets/images/" + resource.id.to_s, ), filename: resource.picture_name)
    dirname = Rails.root + "app/assets/images";
    file_name = resource.picture_name;
    file = Base64.strict_encode64(file_name)
    FileUtils.mkdir_p(dirname) unless Dir.exists?(dirname)
    path = dirname + file;
    File.new(path, 'w+');
    resource.picture.attach(io: File.open(path), filename: file);
    resource.save
    Rails.logger.info(@user.errors.inspect)
    yield resource if block_given?
    if resource.persisted?
      if resource.active_for_authentication?
        #set_flash_message! :notice, :signed_up
        sign_up(resource_name, resource)
        render json: {success: true, email: resource.email}
        #respond_with resource, location: after_sign_up_path_for(resource)
      else
        #set_flash_message! :notice, :"signed_up_but_#{resource.inactive_message}"
        expire_data_after_sign_in!
  
        render json: {success: false, email: resource.email}
        #respond_with resource, location: after_inactive_sign_up_path_for(resource)
      end
    else
      clean_up_passwords resource
      set_minimum_password_length
  
      render json: {success: false, email: resource.email}
      #respond_with resource
    end
  end
  
  # GET /resource/sign_up
  # def new
  #   super
  # end

  # POST /resource
  # def create
  #   super
  # end

  # GET /resource/edit
  # def edit
  #   super
  # end

  # PUT /resource
  # def update
  #   super
  # end

  # DELETE /resource
  # def destroy
  #   super
  # end

  # GET /resource/cancel
  # Forces the session data which is usually expired after sign
  # in to be expired now. This is useful if the user wants to
  # cancel oauth signing in/up in the middle of the process,
  # removing all OAuth session data.
  # def cancel
  #   super
  # end

  # protected

  # If you have extra params to permit, append them to the sanitizer.
  def configure_sign_up_params
    devise_parameter_sanitizer.permit(:sign_up, keys: [:firstname, :lastname, :address, :city, :postal_code, :province, :phone_number])
  end

  # If you have extra params to permit, append them to the sanitizer.
  # def configure_account_update_params
  #   devise_parameter_sanitizer.permit(:account_update, keys: [:attribute])
  # end

  # The path used after sign up.
  # def after_sign_up_path_for(resource)
  #   super(resource)
  # end

  # The path used after sign up for inactive accounts.
  # def after_inactive_sign_up_path_for(resource)
  #   super(resource)
  # end

  private

  # Notice the name of the method
  def sign_up_params
    params.require(:registration).permit(:email, :password, :firstname, :lastname, :address, :city, :postal_code, :province, :phone_number, :picture_name)
  end

end
