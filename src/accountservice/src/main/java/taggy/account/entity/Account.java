package taggy.account.entity;

import java.util.Objects;

import javax.annotation.processing.Generated;

// import jakarta.persistence.Entity;
// import jakarta.persistence.Table;
// import jakarta.persistence.GeneratedValue;
// import jakarta.persistence.Id;
// import jakarta.persistence.GenerationType;
import jakarta.persistence.*;

@Entity
@Table(name = "accounts")
public class Account{ 
    @Id 
    @Column(name = "id")
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "name")
    private String name;
    
    @Column(name = "password")
    private String password;
    
    public Account() {}
    public Account(String name) {
        this.name = name;
    }

    public Long getId(){
        return this.id;
    }

    public String getName(){
        return this.name;
    }

    public void setId(Long id){
        this.id = id;
    }

    public void setName(String name){
        this.name = name;
    }

    @Override
    public String toString(){
        return String.format("Account[id=%s, name=%s]", id, name);
    }

    @Override
    public boolean equals(Object o){
        if(this == o)
            return true;
        if(!(o instanceof Account))
            return false;
        Account account = (Account) o;
        return Objects.equals(this.id, account.id) && Objects.equals(this.name, account.name);
    }

    @Override
    public int hashCode(){
        return Objects.hash(this.id, this.name);
    }
}

