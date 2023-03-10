class Api::ConversationsController < ApplicationController
    before_action :authenticate_user!
    
    def index 
        if current_user.is_admin
            if params[:s] == ""
                @conversations = Conversation.all.order(:status)
                render json: {conversations: @conversations.to_json(:include => :user), success: true}
            #Search    
            elsif params[:q]
                @querry = Array.new
                @querry = params[:q].split("(*)")
                if @querry[0] == "Nom"
                    @users = User.where("MATCH(firstname, lastname) AGAINST(? IN BOOLEAN MODE)", @querry[1])
                    if @querry[2] == "Tout"
                        @conversations = Conversation.where(user_id:[@users.select(:id)])
                        render json: {conversations: @conversations.to_json(:include => :user), success: true}
                    elsif @querry[2] == "En cours"
                        @conversations = Conversation.where(user_id:[@users.select(:id)], status: "En cours")
                        render json: {conversations: @conversations.to_json(:include => :user), success: true}
                    elsif @querry[2] == "Terminer"
                        @conversations = Conversation.where(user_id:[@users.select(:id)], status: "Terminer")
                        render json: {conversations: @conversations.to_json(:include => :user), success: true}
                    end
                elsif @querry[0] == "Email"
                    #@users = User.where("MATCH(email) AGAINST(? IN BOOLEAN MODE)", + @querry[0] + "*")
                    #*En se fiant à stackoverflow, il semble qu'un fulltext sur une addresse email pose problème. D'où mon utilisation ici d'un LIKE
                    # lien stackoverflow : https://stackoverflow.com/questions/22736163/mysql-innodb-full-text-search-containing-email-address/40400206
                    #De plus, James m'a dit que c'était OK :)
                    @users = User.where("email LIKE ?", "%" + @querry[1] + "%")
                    if @querry[2] == "Tout"
                        @conversations = Conversation.where(user_id:[@users.select(:id)])
                        render json: {conversations: @conversations.to_json(:include => :user), success: true}
                    elsif @querry[2] == "En cours"
                        @conversations = Conversation.where(user_id:[@users.select(:id)], status: "En cours")
                        render json: {conversations: @conversations.to_json(:include => :user), success: true}
                    elsif @querry[2] == "Terminer"
                        @conversations = Conversation.where(user_id:[@users.select(:id)], status: "Terminer")
                        render json: {conversations: @conversations.to_json(:include => :user), success: true}
                    end
                elsif @querry[0] == "Titre"
                    @conversations = Conversation.where("MATCH(title) AGAINST(? IN BOOLEAN MODE)", @querry[1])
                    if @querry[2] == "Tout"
                        render json: {conversations: @conversations.to_json(:include => :user), success: true}
                    elsif @querry[2] == "En cours"
                        render json: {conversations: @conversations.where(status: "En cours").to_json(:include => :user), success: true}
                    elsif @querry[2] == "Terminer"
                        render json: {conversations: @conversations.where(status: "Terminer").to_json(:include => :user), success: true}
                    end
                end
            #Sort
            elsif params[:s] == "fullnameUp"
                @users = User.where(id:[Conversation.all.select(:user_id)]).order(:fullname)
                #@conversations = Conversation.where(user_id:[@users.all.select(:id)])
                render json: {conversations: @users.to_json(:include => :conversation), success: true}
            elsif params[:s] == "fullnameDown"
                @users = User.where(id:[Conversation.all.select(:user_id)]).order(fullname: :desc)
                #@conversations = Conversation.where(user_id:[@users.all.select(:id)])
                render json: {conversations: @users.to_json(:include => :conversation), success: true}
            elsif params[:s] == "emailUp"
                @users = User.where(id:[Conversation.all.select(:user_id)]).order(:email)
                #@conversations = Conversation.where(user_id:[@users.all.select(:id)])
                render json: {conversations: @users.to_json(:include => :conversation), success: true}
            elsif params[:s] == "emailDown"
                @users = User.where(id:[Conversation.all.select(:user_id)]).order(email: :desc)
                #@conversations = Conversation.where(user_id:[@users.all.select(:id)])
                render json: {conversations: @users.to_json(:include => :conversation), success: true}
            elsif params[:s] == "creationDateUp"
                @conversations = Conversation.all.order(:created_at)
                render json: {conversations: @conversations.to_json(:include => :user), success: true}
            elsif params[:s] == "creationDateDown"
                @conversations = Conversation.all.order(created_at: :desc)
                render json: {conversations: @conversations.to_json(:include => :user), success: true}
            elsif params[:s] == "titleUp"
                @conversations = Conversation.all.order(:title)
                render json: {conversations: @conversations.to_json(:include => :user), success: true}
            elsif params[:s] == "titleDown"
                @conversations = Conversation.all.order(title: :desc)
                render json: {conversations: @conversations.to_json(:include => :user), success: true}
            elsif params[:s] == "statusUp"
                @conversations = Conversation.all.order(:status)
                render json: {conversations: @conversations.to_json(:include => :user), success: true}
            elsif params[:s] == "statusDown"
                @conversations = Conversation.all.order(status: :desc)
                render json: {conversations: @conversations.to_json(:include => :user), success: true}
            #Filter
            elsif params[:f] == "Tout"
                @conversations = Conversation.all.order(:status)
                render json: {conversations: @conversations.to_json(:include => :user), success: true}
            elsif params[:f] == "En cours"
                @conversations = Conversation.where("MATCH(status) AGAINST(? IN BOOLEAN MODE)", params[:f])
                render json: {conversations: @conversations.to_json(:include => :user), success: true}
            elsif params[:f] == "Terminer"
                @conversations = Conversation.where("MATCH(status) AGAINST(? IN BOOLEAN MODE)", params[:f])
                render json: {conversations: @conversations.to_json(:include => :user), success: true}
            else
                @conversations = Conversation.find(1)
                render json: {success: false, error: [@conversations.errors]}
            end
        else
            @conversation = current_user.conversation
            if @conversation.length > 0
                render json: {conversation: @conversation[0], success: true}
            else
                render json: {success: false, error: "User doesn't have a conversation"}
            end
        end
    end

    def show
        if current_user.is_admin
            if @conversation = Conversation.find(params[:id])
                render json: {conversation: @conversation, success: true}
            else
                @conversation = Conversation.find(params[:id])
                render json: {success: false, error: [@conversation.errors]}
            end
        else
            @conversation = current_user.conversation
            if @conversation[0].status == "En cours"
                render json: {conversation: @conversation[0], success: true}
            else
                @conversation = current_user.conversation
                render json: {success: false, error: [@conversation.errors]}
            end
        end
    end

    def create
        @conversation = current_user.conversation.create(conversation_params)
        @conversation.user_id = current_user.id
        if @conversation.save
            render json: {conversation: @conversation, success: true}
        else
            render json: {success: false, error: [@conversation.errors]}
        end
    end

    def update
        @conversation = current_user.conversation.find(params[:id])
        if @conversation.user_id != current_user.id
            redirect_to ''
        else
            if @conversation.update(conversation_params)
                render json: {conversation: @conversation, success: true}
            else
                render json: {success: false, error: [@conversation.errors]}
            end
        end  
    end

    def destroy
        if !current_user.is_admin
            redirect_to ''
        else
            @conversation = Conversation.find(params[:id])
            if @conversation.destroy
                render json: {conversation: @conversation, success: true}
            else
                render json: {success: false, error: [@conversation.errors]}
            end
        end
    end

    private 
    def conversation_params
        params.require(:conversation).permit(:title, :description, :status)
    end

    def search_params
        params.require(:querry).permit(:q, :t)
    end
end
