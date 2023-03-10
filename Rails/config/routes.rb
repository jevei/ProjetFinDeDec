Rails.application.routes.draw do
  devise_for :users, controllers: {
    sessions: 'users/sessions',
    registrations: 'users/registrations'
  }
  root to: "angular#index"
  namespace :api, constraints: { format: 'json' }  do
    resources :products
    resources :users do
      resources :carts
    end
    resources :commands do
      resources :command_products
    end
    resources :conversations
    resources :messages
    resources :products_sommaries
    resources :user_commands_summaries
    resources :user_conversation_messages_summaries
  end

  match '*url', to: "angular#index", via: :get # le parametre url contiendra tout ce qui suit l'étoile dans l'url
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
