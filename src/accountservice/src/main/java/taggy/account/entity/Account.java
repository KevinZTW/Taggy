package taggy.account.entity;

import java.util.Objects;

import javax.annotation.processing.Generated;
import org.hibernate.annotations.GenericGenerator;

// import jakarta.persistence.Entity;
// import jakarta.persistence.Table;
// import jakarta.persistence.GeneratedValue;
// import jakarta.persistence.Id;
// import jakarta.persistence.GenerationType;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "accounts")
@Data
public class Account{     


    public static final String ROLE_ADMIN = "ADMIN";
    public static final String ROLE_USER = "USER";

    @Id 
    @Column(name = "id")
    @GenericGenerator(name = "uuid2", strategy = "uuid2")
    @GeneratedValue(strategy = GenerationType.IDENTITY, generator = "uuid2")
    // @GeneratedValue(strategy=GenerationType.IDENTITY)
    private String id;
    
    @Column(name = "name")
    private String name;

    @Column(name = "email")
    private String email;
    
    @Column(name = "password")
    private String password;
    
    @Column(name = "role")
    private String role;

    public Account() {}
    public Account(String name, String email, String password, String role) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
    }

    // public Long getId(){
    //     return this.id;
    // }

    // public String getName(){
    //     return this.name;
    // }

    // public void setId(Long id){
    //     this.id = id;
    // }

    // public void setName(String name){
    //     this.name = name;
    // }

    // @Override
    // public String toString(){
    //     return String.format("Account[id=%s, name=%s]", id, name);
    // }

    // @Override
    // public boolean equals(Object o){
    //     if(this == o)
    //         return true;
    //     if(!(o instanceof Account))
    //         return false;
    //     Account account = (Account) o;
    //     return Objects.equals(this.id, account.id) && Objects.equals(this.name, account.name);
    // }

    // @Override
    // public int hashCode(){
    //     return Objects.hash(this.id, this.name);
    // }
}

